const { MessageActionRow, MessageButton } = require('discord.js');
const { ticket_delete } = require('../reactions/delete');
const { validateTicketPanel_Channel } = require('../src/connect');

module.exports = {
    data: {
        name: 'delete',
        description: 'Deletes the order',
    },
    cooldown: 3,
    guildOnly: true,
    async execute(interaction) {
        await interaction.deferReply();

        const res = await validateTicketPanel_Channel(interaction.channelId);
        if (res) {
            await ticket_delete(interaction, interaction.user);
        } else {
            await interaction.followUp('This command can only be used in a ticket channel.');
        }
    },
};
