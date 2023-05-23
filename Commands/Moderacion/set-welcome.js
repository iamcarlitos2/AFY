const { Message, SlashCommandBuilder, PermissionFlagsBits, IntentsBitField, IntegrationApplication, InteractionResponse} = require('discord.js');
const welcomeSchema = require('../../Models/Welcome');
const { model, Schema } = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-welcome")
    .setDescription('Asocias el sistema de bienvenidas en el canal de tu servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('channel')
        .setDescription('Indica el canal donde quieras agregar el sistema de bienvenidas!')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('welcome-message')
        .setDescription('Escribe el mensaje de bienvenida')    
        .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName('welcome-role')    
        .setDescription('Escribe el rol que deseas')
        .setRequired(true)
    ),

    async execute(interaction) {
        const { channel, options} = interaction;

        const welcomeChannel = options.getChannel('channel');
        const welcomeMessage = opstions.getString("welcome-message");
        const roleId = options.getRole('welcome-role');

        if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            interaction.reply({ content: `:x: No tienes suficientes permisos para hacer esto!`, ephemeral: true});
        }

        welcomeSchema.findOne({Guild: interaction.guild.id}, async (err, data) => {
            if(!data) {
                const newWelcome = await welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: welcomeChannel.id,
                    Msg: welcomeMessage,
                    Role: roleId.id
                });
            }
            interaction.reply({content: 'Se ha creado correctamente el mensaje de bienvenida!'})
        })
    }
}