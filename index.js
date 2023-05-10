const discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const client = new discord.Client({
    intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGES],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true}
});

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.events = new discord.Collection();

//Command handler
fs.readdirSync('./commands/').forEach(dir =>{
    fs.readdir(`./commands/${dir}`, (err, files) => {
        if (err) throw err;

        var jsFiles = files.filter(f => f.split(".").pop() === "js");
        if(jsFiles.length <= 0) return console.log('No he encontrado ningun comando!');

        jsFiles.forEach(file => {
            var fileGet = require(`./commands/${dir}/${file}`);
            console.log(`Comando ${file}, cargado correctamente!`)

            try {
                client.commands.set(fileGet.help.name, fileGet);
                fileGet.help.aliases.forEach(alias => {
                    client.aliases.set(alias, fileGet.help.name);
                })
            } catch (err) {
                return console.log(err);
            }
        });
    });
});

//Event handler
fs.readdirSync('./events/').forEach(dir =>{
    fs.readdir(`./events/${dir}`, (err, files) => {
        if (err) throw err;

        var jsFiles = files.filter(f => f.split(".").pop() === "js");
        if(jsFiles.length <= 0) return console.log('No he encontrado ningun evento!');

        jsFiles.forEach(file => {
            const eventGet = require(`./events/${file}`);
            
            try {
                client.events.set(eventGet.name, eventGet);
            } catch (error) {
                return console.log(error);
            }
        });
    });
});

//Token
client.login(process.env.TOKEN);