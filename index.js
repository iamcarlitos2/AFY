const { Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const logs = require('discord-logs');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,

    ],
    partials: [
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.ThreadMember,
    ]
});

logs(client, {
    debug: true
});


const {loadEvents} = require('./Handlers/eventHandler');
const {loadCommands} = require('./Handlers/commandHandler');

client.commands = new Collection();
client.config = require('./config.json');


//Token
client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});