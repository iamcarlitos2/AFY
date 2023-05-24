const { CommandInteraction, IntentsBitField } = require('discord.js');

module.exports = {
    name: "interactionCreate",

    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                interaction.reply({ content: 'Comando desactualizado' });
            }
            command.execute(interaction, client);
        } else {
            console.log('He llegado aqui'); //Solo saltara cuando sea un slashcommand
        }
    }
}
