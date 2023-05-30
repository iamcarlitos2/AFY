const rrSchema = require('../../Models/ReactionRoles');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-role")
        .setDescription("Añades un rol mediante una reaccion")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addRoleOption(option =>
            option.setName("role")
            .setDescription("El rol ha sido asignado")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
            .setDescription("Descripcion del rol")
            .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("emoji")
            .setDescription("Emoji del rol")
            .setRequired(false)
        ),

        async execute(interaction) {
            const { options, guildId, member } = interaction;

            const role = options.getRole("role");
            const description = options.getString("description");
            const emoji = options.getString("emoji");

            try {
                if(role.position >= member.roles.highest.position)
                    return interaction.reply({ content: 'No tengo suficientes permisos para realizar esto!', ephemeral: true });
                
                const data = await rrSchema.findOne({ GuildID: guildId })
                const newRole = {
                    roleId: role.id,
                    roleDescription: description || 'No hay descripcion',
                    roleEmoji: emoji || "",
                }

                if (data) {
                    let roleData = data.roles.find((x) => x.roleId === role.id);

                    if (roleData) {
                        roleData = newRoleData;
                    } else {
                        data.roles = [...data.roles, newRole]
                    }

                    await data.save();
                } else {
                    await rrSchema.create({
                        GuildID: guildId,
                        roles: newRole,
                    });
                }

                return interaction.reply({ content: `He creado un nuevo rol **${role.name}**`});
            } catch (error) {
                console.log(error);
            }
        }
}