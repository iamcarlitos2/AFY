const { MessageActionRow, MessageButton} = require('discord.js');
const { mongo } = require('mongoose');

module.exports = {
    name: 'add',
    description: 'Agregas un nuevo usuario al ticket',
    cooldown: 3,
    guildOnly: true,
    args: true,
    async execute(message, args, client) {
        await message.delete();

        const mentionedUser = message.mentions.users.first() || await client.users.fetch(args[0]);

        if (!mentionedUser) {
            return message.reply('Please mention a user or provide a valid user ID.');

        }

        const auID = mentionedUser.id;

        mongo.validateTicket_Channel(message.channel.id, async (res) => {
            if (res) {
                await message.channel.permissionOverwrites.edit(auID, { VIEW_CHANNEL: true}, 'Added to Order');

                mongo.updateTicketAdd(message.channel.id, auID, (r) => {
                    if (r) {
                        const addedButton = new MessageButton()
                            .setCustomId('added_button')
                            .setLabel('Added')
                            .setStyle('PRIMARY');
                        
                        const row = new MessageActionRow().addComponents(addedButton);

                        return message.channel.send({ content: `Added ${mentionedUser.tag} to the ticket.`, components: [row] });
                    }
                });
            }
        });
    }
};