const discord = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const client = new discord.Client({
    intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true}
});

client.commands = new discord.Collection();
client.aliases = new discord.Collection();

//Command handler
fs.readdirSync('./commands/').forEach(dir =>{
    fs.readdir(`./commands/${dir}`, (err, files) => {
        if (err) throw err;

        var jsFiles = files.filter(f => f.split(".").pop() === "js");
        if(jsFiles.length <= 0) return console.log('No he encontrado ningun comando!');

        jsFiles.forEach(file => {
            var fileGet = require(`./commands/${dir}/${file}`);
            console.log(`Archivo ${file}, cargado correctamente!`)

            try {
                client.commands.set(fileGet.help.name, fileGet)
                fileGet.help.aliases.forEach(alias => {
                    client.aliases.set(alias, fileGet.help.name);
                })
            } catch (err) {
                return console.log(err);
            }
        });
    });
});

client.on('ready', () => {
    client.user.setPresence({ activities: [{name: 'Developing', type: 'PLAYING'}] })
    console.log(`${client.user.tag} is ready!`)
});

client.on('messageCreate', async message => {
    if(message.author.bot || message.channel.type == 'DM') return
});

client.login(token);