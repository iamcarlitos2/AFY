const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Desbaneas a u miembro del servidor")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName("target")
            .setDescription("Se requiere el Discord ID, para desbanear al usuario")
            .setRequired(true)
        )
        .addUserOption(option =>
            option.setName("reason")
            .setDescription("Escibe una razon para desbanear al usuario")
            .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const userId = options.getString("target");
        const reason = options.getString("reason");

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
            .setDescription(`Se ha desbaneado correctamente el ID ${userId} por el motivo: ${reason}`)
            .setColor('Green')
            .setTimestamp();

            await interaction.reply({
                embeds: [embed],
            });
        } catch (err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription('Porfavor, escribe una ID valida!')
                .setColor('Red')
            interaction.reply({embeds: [errEmbed], ephemeral: true});
        }
    }
}