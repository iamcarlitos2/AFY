const { MessageEmbed } = require('discord.js');
const { ticketUpdateStatusClose, updateOverwrite, validateTicketPanelChannel, ticketPanelUpdateStatusClose, newTicketPanel } = require('../src/connect');

async function ticketMessage(id) {
    return new MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle('**Ticket Closed**')
        .setDescription(`This ticket closed by <@${id}>`)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
}

async function wrong(auID) {
    return new MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${auID}> Something Went wrong. Please Try again`)
        .setTimestamp()
        .setFooter('');
}

async function ticketClose(message, user, result) {
    try {
        await ticketUpdateStatusClose(message.channel.id, async (res) => {
            if (res) {
                await updateOverwrite(result.authorID, { VIEW_CHANNEL: false }, 'Ticket Closed').then(m => {
                    if (result.add) {
                        for (const member of result.add) {
                            updateOverwrite(member, { VIEW_CHANNEL: false });
                        }
                    }

                    message.channel.send(ticketMessage(user.id)).then(async msg => {
                        await msg.react('🔓');
                        await msg.react('🗒️');
                        await msg.react('⛔');

                        await validateTicketPanelChannel(message.channel.id, async (res1) => {
                            if (res1) {
                                await ticketPanelUpdateStatusClose(message.channel.id, msg.id, async (res2) => {
                                    if (res2) {
                                        return console.log('Order Close Panel Updated and Order Closed');
                                    }
                                });
                            } else {
                                await newTicketPanel(message.guild.id, user.id, message.channel.id, msg.id, async (r) => {
                                    if (r) {
                                        await ticketPanelUpdateStatusClose(message.channel.id, msg.id, async (r1) => {
                                            if (r1) {
                                                return console.log('Order Closed Successfully');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });
    } catch (err) {
        console.log(err);
        return message.channel.send(await wrong(user.id));
    }
}

module.exports = { ticketClose };
