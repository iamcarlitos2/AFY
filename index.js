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
client.SlashCmds = new discord.Collection();
module.exports.client = client

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
fs.readdirSync('./events/').forEach(file =>{
    var jsFiles = fs.readdirSync('./events/').filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) return console.log('No he encontrado ningun evento!');
    let check = false

    jsFiles.forEach(file => {
        const eventGet = require(`./events/${file}`)

        try {
            client.events.set(eventGet.name, eventGet)
            if(check == false) {
                console.log(`Evento ${file}, ha sido cargado!`)
                check = true
            }
        } catch (error) {
            return console.log(error)
        }
    });
});

//SlashCommand
fs.readdirSync('./SlashCommands/').forEach(dir =>{
    fs.readdir(`./SlashCommands/${dir}`, (err, files) => {
        if (err) throw err;

        var jsFiles = files.filter(f => f.split(".").pop() === "js");
        if(jsFiles.length <= 0) return console.log('No he encontrado ningun comando!');

        jsFiles.forEach(file => {
            var fileGet = require(`./SlashCommands/${dir}/${file}`);
            console.log(`SlashCommand ${file}, cargado correctamente!`)

            try {
                client.SlashCmds.set(fileGet.help.name, fileGet);
            } catch (err) {
                return console.log(err);
            }
        });
    });
});

//Token
client.login(process.env.TOKEN);