const fs = require('fs');
const { Client, Collection, Intents} = require('discord.js');
const config = require('./config.json');
//const general = require('./reactions/general');
// const resell = require('./reactions/resell');
// const kick = require('./reactions/kick');
// const paypal = require('./reactions/paypal');
// const close = require('./reactions/close');
// const reopen = require('./reactions/reopen');
// const transcript = require('./reactions/transcript');
// const ticket = require('./reactions/delete');



const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Map();

client.once('ready', () => {
    console.log('Conectado!');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;

    if (command.guildOnly && message.channel.type !== 'GUILD_TEXT') {
        return message.channel.send({
            content: "Hey bro soy un bot no hablo por MD",
            color: '#d40808',
        });
    }
    if (command.args && !args.length) {
        const reply = command.usage
        ? `Necesito argumentos, ${message.author}!\nPara ser bien usado escribe: \`${prefix}${command.name} ${command.usage}\``
        : `Necesito argumentos, ${message.author}!`;
    
        return message.channel.send({
          content: reply,
          color: '#d40808',
        }).then(msg => msg.delete({ timeout: 10000 }));
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmmount = (command.cooldown || 3) * 1000;

    if (TimestampStyles.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            
            return message.channel.send({
                content: `Espera ${timeLeft.toFixed(1)} mas segundos para usar el comando \`${command.name}\``,
                color: '#d40808',
            }).then(msg => msg.delete({ timeout: 10000 }));
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmmount);

    try {
        command.execute(message, args, client);
    } catch (error) {
        return message.channel.send({
            content: `Hay un error y no se puede ejecutar el comando`,
            color: '#d40808',
        }).then(msg => msg.delete({ timeout: 10000 }));
    }
});

client.on('messageReactionAdd', async (messageReaction, user) => {
    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Algo ha ido mal');
            return;
        }
    }

    if (messageReaction.emoji.name === '❓' && !user.bot) {
        mongo.validatePanel(messageReaction.message.id, async (res) => {
          if (res) {
            await messageReaction.users.remove(user.id);
            general.general_ticket(messageReaction.message, user);
          }
        });
      }
});


//Token
client.login(client.config.token);