const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'help menu',
    cooldown: 3,
    guildOnly: true,
    async execute(message) {
    const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('Command List')
        .setDescription(`Here are some available commands:\n\n` +
            `\`${prefix}add <Mention || ID>\` - Helps to add a member to the ticket\n` +
            `\`${prefix}close\` - Closes the ticket\n` +
            `\`${prefix}config [command] [value]\` - A Configuration to server\n` +
            `\`${prefix}delete\` - Deletes the order\n` +
            `\`${prefix}help\` - Displays this help menu\n` +
            `\`${prefix}panel\` - Helps to create a ticket panel\n` +
            `\`${prefix}reopen\` - Reopens the closed ticket\n` +
            `\`${prefix}setup\` - Helps to set up the server and in the database\n` +
            `\`${prefix}transcript\` - Saves the order transcript through webhook`)
        .setTimestamp()
        .setFooter('popyfres - Type !help')

        return message.channel.send({ embeds: [embed] });
    },
    
};
    


