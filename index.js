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

const cooldowns = new Collection();

client.once('ready', () => {
    console.log('AFY tickets esta conectado!');
});



//Token
client.login(client.config.token);