const { MessageEmbed } = require('discord.js');
const { validateTicketAuthor, validateConfig, newTicket } = require('../src/connect');

async function ticketMessage(id) {
    return new MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle('**Kicked From Plan Ticket**')
        .setDescription(`Hello <@${id}> ,\nPlease post these below to get replacement\n\n` +
            `**1.** Shoppy Email and Spotify Email. (If both are the same then just send the email only once)\n` +
            `**2.** Shoppy Order ID\n` +
            `**3.** Screenshot of Shoppy where the order ID and Email should be visible\n` +
            `**4.** Screenshot of Spotify where you got kicked where the Date and Email should be Visible\n` +
            `**5.** Your Key (Which you used to redeem)\n\n` +
            `If Failed to provide this information. Our Support member will close this ticket without any prior notice and you'll not get any replacement`)
        .setTimestamp()
        .setFooter('popyfres - Typle !help');
}

async function spamTicket(auID, chID) {
    return new MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${auID}> You've Already a Ticket opened at <#${chID}>`)
        .setTimestamp()
        .setFooter('popyfres - Typle !help');
}

async function verifyClosed(res) {
    const response = {
        status: false,
        channel: null,
    };

    for (const data of res) {
        if (data.status !== 'closed') {
            response.status = true;
            response.channel = data.channelID;
            break;
        }
    }

    return response;
}

async function kickTicket(message, user) {
    try {
        const res = await validateTicketAuthor(user.id);
        const status = await verifyClosed(res);

        if (status.status === true) {
            return user.send(await spamTicket(user.id, status.channel));
        } else {
            const channel = await message.guild.channels.create(`kicked-${user.username}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: user.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
            });

            const roles = await validateConfig(message.guild.id);

            if (roles) {
                if (roles.support.roles) {
                    const roleIds = roles.support.roles.split(',');

                    for (const role of roleIds) {
                        await channel.permissionOverwrites.create(role, { VIEW_CHANNEL: true });
                    }
                }

                await channel.send(`<@${user.id}>`);
                const msg = await channel.send(await ticketMessage(user.id));
                await msg.react('🔒');

                await newTicket(message.guild.id, user.id, channel.id, msg.id, (result) => {
                    if (result) {
                        console.log('New Ticket Created Successfully');
                    }
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { kickTicket };