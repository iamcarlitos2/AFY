const { MessageEmbed, WebhookClient } = require('discord.js');
const { validateTicketChannel, validateConfig } = require('../src/connect');
const { chatExport } = require('../Chat/cmd');

async function ticketMessage(channel, user) {
    return new MessageEmbed()
        .setColor('#bbf1c8')
        .setTitle(`Transcript of ${user.username}#${user.discriminator}`)
        .addField('Ticket Owner', `<@${user.id}>`, true)
        .addField('Ticket Name', `${channel.name}`, true)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
}

async function transcriptMessage() {
    return new MessageEmbed()
        .setColor('#bbf1c8')
        .setDescription('Transcript Saved');
}

async function transcripting() {
    return new MessageEmbed()
        .setColor('#fbd46d')
        .setDescription('Transcript Saving');
}

async function wrong(auID) {
    return new MessageEmbed()
        .setColor('#c70039')
        .setDescription(`<@${auID}> Something Went wrong. Ensure you have defined the proper transcript channel with $config transcript <channelID> command.`)
        .setTimestamp()
        .setFooter('popyfres - Type !help');
}

async function createTranscript(message, user) {
    validateTicketChannel(message.channel.id, async (res) => {
        if (res) {
            validateConfig(message.guild.id, async (config) => {
                if (config) {
                    await message.channel.send(await transcripting()).then(async (msg) => {
                        const webhookClient = new WebhookClient({ id: config.transcript.webhookID, token: config.transcript.webhookToken });
                        await chatExport(message.channel.id, user.username).then(async (file) => {
                            const embed = await ticketMessage(message.channel, user);

                            await webhookClient.send({
                                username: 'Transcript',
                                files: [file],
                                embeds: [embed],
                            }).then(async () => {
                                return await msg.edit(await transcriptMessage());
                            }).catch(async (err) => {
                                console.log(err);
                                return await msg.edit(await wrong(user.id));
                            });
                        });
                    });
                }
            });
        }
    });
}

module.exports = { createTranscript };
