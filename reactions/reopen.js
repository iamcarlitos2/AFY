const { MessageEmbed } = require('discord.js');
const { updateOverwrite, validateTicketChannel, ticketUpdateStatusReopen, ticketPanelUpdateStatusReopen } = require('../src/connect');

async function ticketMessage(id) {
    return new MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle('**Ticket Reopened**')
        .setDescription(`This ticket Reopened by <@${id}>`)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
}

async function wrong(auID) {
    return new MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${auID}> Something Went wrong. Please Try again`)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
}

async function ticketReopen(message, user, result, client) {
    try {
        await updateOverwrite(result.authorID, { VIEW_CHANNEL: true }, 'Ticket ReOpened').then(async () => {
            await validateTicketChannel(message.channel.id, async (res) => {
                if (res) {
                    if (res.add[0]) {
                        for (const member of res.add) {
                            await client.users.fetch(member).then(async (user) => {
                                await updateOverwrite(user, { VIEW_CHANNEL: true }, 'Ticket-Reopened').then(async () => {});
                            });
                        }

                        await ticketUpdateStatusReopen(message.channel.id, async (res1) => {
                            if (res1) {
                                await ticketPanelUpdateStatusReopen(message.channel.id, async (res) => {
                                    if (res) {
                                        return message.channel.send(await ticketMessage(user.id));
                                    }
                                });
                            }
                        });
                    } else {
                        await ticketUpdateStatusReopen(message.channel.id, async (res1) => {
                            if (res1) {
                                await ticketPanelUpdateStatusReopen(message.channel.id, async (res) => {
                                    if (res) {
                                        return message.channel.send(await ticketMessage(user.id));
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }).catch((err2) => {
            console.log(err2);
        });
    } catch (err) {
        console.log(err);
        return message.channel.send(await wrong(user.id));
    }
}

module.exports = { ticketReopen };
