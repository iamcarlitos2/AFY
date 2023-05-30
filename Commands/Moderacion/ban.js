const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Baneas un miembro del servidor")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('target')
            .setDescription('Usuario a banear')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Razon del baneo")
            .setRequired(true)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("target");
        const reason = options.getString("reason");

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`🚫 No puedes banear a ${user.username}, porque tiene mas permisos.`)
            .setColor('Red');
        
        if(member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});
        
        await member.ban([reason]);

        const embed = new EmbedBuilder()
        .setDescription(`Se ha baneado correctamente a ${user.username}, por el siguiente motivo: ${reason}`)
        .setColor('Green')
        .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
}