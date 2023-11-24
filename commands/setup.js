const { MessageEmbed } = require('discord.js');
const mongo = require('../src/connect');

function alreadyDone(id) {
    return new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${id}> This server is already registered`)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
        
}

function success(id) {
    return new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`<@${id}> This server is successfully registered`)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
    
}

function noAdmin(id) {
    return new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${id}> You're not an Admin`)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
}

module.exports = {
    name: 'setup',
    description: 'Helps to Register Server',
    cooldown: 3,
    guildOnly: true,
    async execute(message, args) {
        message.delete();

        try {
            if (message.member.permissions.has('ADMINISTRATOR')) {
                const result = await mongo.validateConfig(message.guild.id);

                if (result) {
                    const alreadyDoneMessage = alreadyDone(message.author.id);
                    if (alreadyDoneMessage && Object.keys(alreadyDoneMessage).length > 0) {
                        await message.channel.send({ embeds: [alreadyDoneMessage]}).then(msg => {
                            msg.delete({ timeout: 15000 });
                        });
                    } else {
                        console.error('Error: alreadyDoneMessage is empty or undefined');
                    }
                } else {
                    await mongo.setupDB(message.author.id, message.guild.id);
                    const successMessage = success(message.author.id);
                    if (successMessage && Object.keys(successMessage).length > 0) {
                        await message.channel.send({ embeds: [successMessage]}).then(msg => {
                            msg.delete({ timeout: 15000 });
                        });
                    } else {
                        console.error('Error: successMessage is empty or undefined');
                    }
                }
            } else {
                const noAdminMessage = noAdmin(message.author.id);
                if (noAdminMessage && Object.keys(noAdminMessage).length > 0) {
                    await message.channel.send({ embeds: [noAdminMessage] }).then(msg => {
                        msg.delete({ timeout: 15000 });
                    });
                } else {
                    console.error('Error: noAdminMessage is empty or undefined');
                }
            }
        } catch (error) {
            console.error('Error during setup:', error);
            if (error.messages) {
                console.error('Error Message: ', error.message);
            }
            // Puedes enviar un mensaje de error al usuario si es necesario
        }
    }
};
