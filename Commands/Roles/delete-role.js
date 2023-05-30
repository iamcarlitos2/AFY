const rrSchema = require('../../Models/ReactionRoles');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove-role")
        .setDescription("Eliminas un rol mediante una reaccion")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption(option =>
            option.setName("role")
            .setDescription("El rol ha sido eliminado")
            .setRequired(true)
        ),
      
        async execute(interaction) {
            const { options, guildId, member } = interaction;

            const role = options.getRole("role");
          

            try {
                                
                const data = await rrSchema.findOne({ GuildID: guildId })
              
                if (!data) 
                    return interaction.reply({ content: `Este servidor no tiene ningun dato`, ephemeral: true });
                const roles = data.roles;
                const findRole = roles.find((r) => r.roleId === role.id);

                if(!findRole)
                    return interaction.reply({ content: `Este rol no existe`, ephemeral: true });
                
                const filteredRoles = roles.filter((r) => r.roleId !== role.id);
                data.roles = filteredRoles;

                await data.save();

                return interaction.reply({ content: `Rol eliminado **${role.name}**`});
            } catch (error) {
                console.log(error);
            }
        }
}