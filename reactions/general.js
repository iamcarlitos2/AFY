const { MessageEmbed } = require('discord.js');
const { mongo } = require('../src/connect');
const ms = require('ms');

function ticketMessage(id) {
    return new MessageEmbed()
    .setColor('GREEN')
    .setTitle('**General Ticket**')
    .setDescription(`Hello <@${id}> ,\nPlease post your questions here. One of our support members will be with you shortly`)
    .setTimestamp()
    .setFooter('popyfres - Type !help')

}

function SpamTicket(auID, chID) {
    return new MessageEmbed()
    .setColor('RED')
    .setDescription(`<@${auID}> You already have a ticket opened at <#${chID}>`)
    .setTimestamp()
    .setFooter('popyfres - Type !help')
    
}

function verify_closed(res) {
    var response = {
        status: false,
        channel: null
    };
    for (const data of res) {
        if (data.status !== 'closed'){
            response.status = true;
            response.channel = data.channelID;
            break;
        }
    }
    return response;
}

async function general_ticket(message, user) {
    mongo.validateTicket_Author(user.id, async (res) => {
        try {
            const status = verify_closed(res);
            if(status.status === true) {
                return user.send(SpamTicket(user.id, status.channel));
            } else {
                const channel = await message.guild.channels.create(`general-${user.username}`, {
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

                const config = await mongo.validateConfig(message.guild.id);
                if (config && config.support.roles) {
                    const roles = config.support.roles.split(',');
                    for (const role of roles) {
                        channel.permissionOverwrites.create(role, { VIEW_CHANNEL: true });
                    }
                }

                await channel.send(`<@${user.id}>`);
                const msg = await channel.send(ticketMessage(user.id));
                await msg.react('🔒');

                mongo.newTicket(msg.guild.id, user.id, channel.id, msg.id, (result) => {
                    if (result) {
                        console.log('New Ticket Created Succedfully!');
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    });
}

module.exports = {
    general_ticket
};