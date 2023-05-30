const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, IntentsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Eliminas el silencio a un miembro del servidor")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Selecciona un miembro para quitar el muteo.")
            .setRequired(true)
        ),
        
        async execute(interaction) {
            const { guild, options } = interaction;

            const user = options.getUser("target");
            const member = await interaction.guild.members.fetch(user.id);
            const errEmbed = new EmbedBuilder()
                .setDescription(":x: Algo ha ido mal, intentalo mas tarde")
                .setColor('Red')
            
            const succesEmbed = new EmbedBuilder()
                .setTitle("✅ **Silenciado**")
                .setDescription(`Se ha desilenciado correctamente al usuario: ${user}`)
                .setColor('Green')
                .setTimestamp();

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            if(!interaction.guild.members.me.permission.has(PermissionFlagsBits.ModerateMembers))
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            try {
                await member.timeout(null);

                interaction.reply({ embeds: [succesEmbed], ephemeral: true });
            } catch (error) {
                console.log(error);
            }
        }
}