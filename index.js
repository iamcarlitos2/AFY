const fs = require('fs');
const { Client, Collection, Intents, MessageReaction, MessageEmbed} = require('discord.js');
const { prefix, token } = require('./config.json');
const { mongo } = require('mongoose');
const general = require('./reactions/general');
const resell = require('./reactions/resell');
const kick = require('./reactions/kick');
const paypal = require('./reactions/paypal');
const close = require('./reactions/close');
const reopen = require('./reactions/reopen');
const transcript = require('./reactions/transcript');
const ticket = require('./reactions/delete');




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

const cooldowns = new Collection();

client.once('ready', () => {
    console.log('AFY tickets esta conectado!');
});

client.on('messageReactionAdd', async (messageReaction, user) => {

    function SpamTicket(auID, chID) {
        return new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${auID}> You've Already a Ticket opened at <#${chID}>`)
        .setTimestamp()
        .setFooter('popyfres  - Type !help ')
    }

    function ticketClosed(auID) {
        return new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`Order Closed by ${auID}`)
        .setTimestamp()
        .setFooter('popyfres - Type !help')
    }

    function ticketDeletePopup() {
        return new MessageEmbed()
        .setColor('ORANGE')
        .setDescription(`This order will be deleted in 5 seconds`)
        .setTimestamp()
        .setFooter('popyfres - Type !help')
    }

    function noAdmin_close(id) {
        return new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${id}> You're not a Admin. You can't Close Ticket`)
        .setTimestamp()
        .setFooter('popyfres - Type !help')
    }

    function noAdmin_delete(id) {
        return new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${id}> You're not a Admin. You can't Close Ticket`)
        .setTimestamp()
        .setFooter('popyfres - Type !help')
    }

    if (messageReaction.partial) {
        //Si la reaccion es parcial intentamos fechearla
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Algo ha salido mal al fetchear el mensaje: ', error);ç
            return;
        }
    }
    
    if(messageReaction.emoji.name === '❓' && !user.bot) {
        await mongo.validatePanel(messageReaction.message.id, async (res) => {
            if(res) {
                await messageReaction.users.remove(user.id);
                general.general_ticket(messageReaction.message, user);
            }
        });
    }

    if(messageReaction.emoji.name === '💳' && !user.bot) {
        await mongo.validatePanel(messageReaction.message.id, async (res) => {
            if (res) {
            await messageReaction.users.remove(user.id);
            paypal.paypal_ticket(messageReaction.message, user);
            }
        });    
    }

    if(messageReaction.emoji.name === '🎵' && !user.bot) {
        await mongo.validatePanel(messageReaction.message.id, async (res) => {
            if (res) {
            await messageReaction.users.remove(user.id);
            resell.resell_ticket(messageReaction.message, user);
            }
        });    
    }

    if(messageReaction.emoji.name === '🛠️' && !user.bot) {
        await mongo.validatePanel(messageReaction.message.id, async (res) => {
            if (res) {
            await messageReaction.users.remove(user.id);
            kick.kick_ticket(messageReaction.message, user);
            }
        });    
    }

    if(messageReaction.emoji.name === '🔒' && !user.bot) {
        await mongo.validateTicket_Channel(messageReaction.message.channel.id, async (res) => {
            if (res && res.messageID === messageReaction.message.id) {
                await messageReaction.users.remove(user.id);
                if (!res.status) {
                    close.ticket_close(messageReaction.message, user, res);
                } else {
                    return;
                }
            }
        });
    }

    if (messageReaction.emoji.name === '🔓' && !user.bot) {
        await mongo.validateTicketPanel_Channel(messageReaction.message.channel.id, async (res) => {
          if (res && res.messageID === messageReaction.message.id) {
            await messageReaction.users.remove(user.id);
            if (res.status === 'closed') {
              reopen.ticket_reopen(messageReaction.message, user, res, client);
            } else {
                return;
            }
          }
        });
    }
    
    if (messageReaction.emoji.name === '🗒️' && !user.bot) {
        await mongo.validateTicketPanel_Channel(messageReaction.message.channel.id, async (res) => {
          if (res && res.messageID === messageReaction.message.id) {
            await messageReaction.users.remove(user.id);
            transcript.create_transcript(messageReaction.message, user);
          }
        });
    }

    if (messageReaction.emoji.name === '⛔' && !user.bot) {
        await mongo.validateTicketPanel_Channel(messageReaction.message.channel.id, async (res) => {
          if (res && res.messageID === messageReaction.message.id) {
            await messageReaction.users.remove(user.id);
            ticket.ticket_delete(messageReaction.message, user);
          }
        });
    }
      

});
//ponemos el client messageCreate

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
                    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (command.guildOnly && message.channel.type !== 'GUILD_TEXT') {
       return message.reply({ content: 'I can\'t execute that command inside DMs!' });
    }

    if (command.args && !args.length) {
        const reply = command.usage ?
            `You didn't provide any arguments, ${message.author}!\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\`` :
            `You didn't provide any arguments, ${message.author}!`;

        return message.reply({ content: reply }).then(msg => {
            msg.delete({ timeout: 10000 });
        });
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply({ content: `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.` })
                .then(msg => msg.delete({ timeout: 10000 }));
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        return message.reply({ content: 'There was an error trying to execute that command!' })
            .then(msg => msg.delete({ timeout: 10000 }));
    }
});

//Token
client.login(token);