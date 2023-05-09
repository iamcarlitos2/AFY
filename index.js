const discord = require('discord.js');
const { token } = require('./config.json');
const client = new discord.Client({
    intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true}
});

client.on('ready', () => {
    client.user.setPresence({ activities: [{name: 'Developing', type: 'PLAYING'}] })
    console.log(`${client.user.tag} is ready!`)
});

client.on('messageCreate', async message => {
    if(message.author.bot || message.channel.type == 'DM') return
});

client.login(token);