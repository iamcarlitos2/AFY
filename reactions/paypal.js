const { MessageEmbed } = require('discord.js');
const { validateTicketAuthor, validateConfig, newTicket } = require('../src/connect');
const { paypal_email } = require('../config.json');

async function ticketMessage(id) {
    return new MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle('**Paypal Related Ticket**')
        .setDescription(`Hello <@${id}> ,\n\nIf you're here to pay with Paypal, please check the below conditions\n\n` +
            `**1.** Will you pay with Family & Friends? Do you know how to use it?\n` +
            `**2.** Will you pay with PayPal balance or with something else?\n` +
            `**3.** Do you understand that charging back payments may have serious consequences?\n` +
            `**4.** We will charge $3+ fees to convert to BTC - will you still pay?\n\n` +
            `If you accept the above conditions, you can pay the amount (Each key $5 + $3 Fee) as **F&F** to \`${paypal_email}\`\n` +
            `After sending the money, please send a screenshot where the Paypal email and current time are visible.\n` +
            `Then you can ping any of our support members, and they'll take care of the rest`)
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

async function paypalTicket(message, user) {
    try {
        const res = await validateTicketAuthor(user.id);
        const status = await verifyClosed(res);

        if (status.status === true) {
            return user.send(await spamTicket(user.id, status.channel));
        } else {
            const channel = await message.guild.channels.create(`paypal-${user.username}`, {
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

module.exports = { paypalTicket };
