const { CommandInteraction, IntentsBitField } = require('discord.js');

module.exports = {
    name: "interactionCreate",

    execute(interaction, client) {
        const {customId, values, fields, member, guild, commandName, channel, guildId, message} = interaction;
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if(!command) {
                return interaction.reply({
                    content: "Comando desactualizado",
                    ephemeral: true,
                });

                command.execute(interaction, client);
            }
            
        } else {
            console.log('He llegado aqui'); //Solo saltara cuando sea un slashcommand
        }
    }
}
