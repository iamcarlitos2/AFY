const {MessageEmbed} = require('discord.js');
const mongo = require('../src/connect');

// Constantes de los emojis
const EMOJI_QUESTION = '❓';
const EMOJI_PAYPAL = '💳';
const EMOJI_RESELLING = '🎵';
const EMOJI_KICKED = '🛠️';

function noAdmin(id) {
    return new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${id}> You're not an Admin`)
        .setTimestamp()
        .setFooter('popyfres - Type !help ');
}

function alreadyDone(id) {
    return new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${id}> This server already has a panel. You can't create another one`)
        .setTimestamp()
        .setFooter('popyfres - Type !help ');
}


function panelMenu() {
   return new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Panel Ticket')
        .setDescription('Please React to this ticket which justifies your problem')
        .addFields(
            { name: 'General Questions', value: `${EMOJI_QUESTION}\n`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Paypal Related Queries', value: `${EMOJI_PAYPAL}\n`, inline: true },
            { name: 'Reselling Related Queries', value: `${EMOJI_RESELLING}\n`, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Kicked From Plan', value: `${EMOJI_KICKED}\n`, inline: true }
        )
        .setTimestamp()
        .setFooter('popyfres - Type !help ');
        }


module.exports = {
    name: 'panel',
    description: 'Reedem to Order',
    cooldown: 3,
    guildOnly: true,
    async execute(message, args) {
        message.delete();

        if (message.member.permissions.has('ADMINISTRATOR')) {
            try {
                const result = await mongo.validateGuild(message.guild.id);

                if (result) {
                    const alreadyDoneMessages = await message.channel.send(alreadyDone(message.author.id));
                    alreadyDoneMessages.delete({ timeout: 15000 });
                } else {
                    const msg = await message.channel.send({ embeds: [panelMenu()] });

                    try {
                        await msg.react('❓');
                        await msg.react('💳');
                        await msg.react('🎵');
                        await msg.react('🛠️');

                        await mongo.createPanel(message.guild.id, message.author.id, msg.id);
                    } catch (error) {
                        console.log('Error reacting to the message:', error);
                    }
                }
            } catch (error) {
                console.error('Error querying MongoDB:', error);
            }
        } else {
            const noAdminMessage = noAdmin(message.author.id);
            await message.channel.send({ embeds: [noAdminMessage] }).then(msg => {
                msg.delete({ timeout: 15000 });
            });
        }
    },
};
