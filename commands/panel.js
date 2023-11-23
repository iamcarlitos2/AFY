const Discord = require('discord.js');
const mongo = require('../src/connect');


//constantes de los emojis
const EMOJI_QUESTION = '❓';
const EMOJI_PAYPAL = '💳';
const EMOJI_RESELLING = '🎵';
const EMOJI_KICKED = '🛠️';

function noAdmin(id) {
    return new Discord.MessageEmbed()
    .setColor('RED')
    .setDescription(`<@${id}> You're not a Admin`)
    .setTimestamp()
    .setFooter('popyfres  - Type !help ')
}

function alreadyDone(id) {
    return new Discord.MessageEmbed()
    .setColor('RED')
    .setDescription(`<@${id}> This server has already have panel. You can't create another on`)
    .setTimestamp()
    .setFooter('popyfres  - Type !help ')
}

function panelMenu(){
    return new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle('Panel Ticket')
    .setDescription('Please React to this ticket which justifies your problem')
    .addField('General Questions', `${EMOJI_QUESTION}\n`, true)
    .addField('\u200B', '\u200B', true)
    .addField('Paypal Related Queries', `${EMOJI_PAYPAL}\n`, true)
    .addField('Reselling Related Queries', `${EMOJI_RESELLING}\n`, true)
    .addField('\u200B', '\u200B', true)
    .addField('Kicked From Plan', `${EMOJI_KICKED}\n`, true)
    .setTimestamp()
    .setFooter('popyfres  - Type !help ')
}

module.exports = {
    name: 'panel',
    description: 'Reedem to Order',
    cooldown: 3,
    guildOnly: true,
    async execute(message, args) {
        message.delete();

        if (message.member.permissions.has('ADMINISTRATOR')) {
            mongo.validateGuild(message.guild.id, async (result) => {
                if (result) {
                    const alreadyDoneMessage = await message.channel.send(alreadyDoneMessage(message.author.id));
                    alreadyDoneMessage.delete({ timeout: 15000 });
                } else {
                    const msg = await message.channel.send(panelMenu());

                    try {
                        await msg.react('❓');
                        await msg.react('💳');
                        await msg.react('🎵');
                        await msg.react('🛠️');

                        mongo.createPanel(message.guild.id, message.author.id, msg.id);
                    } catch (error) {
                        console.log('Error reacting to the message:', error);
                    }
                }
            });
        } else {
            const noAdminMessages = await message.channel.send(noAdmin(message.author.id));
            noAdminMessage.delete({ timeout: 15000 });
        }
    },
};