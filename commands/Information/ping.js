const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    message.channel.send('pong')

}

module.exports.help = {
    name:"ping",
    aliases: ["p"]
}