const { CommandInteraction, IntentsBitField } = require('discord.js');

module.exports = {
    name: "interactionCreate",

    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) {
            const command = client.commands.set(interaction.commandName);

            if (!command) {
                interaction.reply({ content: 'Comando desactualizado' });
            }

            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            const role = interaction.guild.roles.cache.get('885261539882463324');
            return interaction.member.roles.add(role).then((member) => interaction.reply({ content: `Se te ha asignado un nuevo rol: ${role}`, ephemeral: true }));
        } else {
            return;
        }
    },
};