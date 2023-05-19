const {EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('Verificador')
    .setDescription('Verificate en este canal')
    .addChannelOption(option => 
        option.setName('canal')
        .setDescription('Envia la verificacion a este canal')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const canal = interaction.options.getChannel('canal');
        const verificarEmbed = new EmbedBuilder()
        .setTitle("Verificacion 📢")
        .setDescription('Pulsa este boton para verificar tu cuenta y poder acceder a los canales.')
        .setColor("Red")
        let sendChannel = channel.send({
            embeds: ([verificarEmbed]),
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                    .setCustomId('verificar')
                    .setLabel('verificar')
                    .setStyle(ButtonStyle.Success)
                ),
            ],
        });
        if (!sendChannel){
            return interaction.reply({content: `Ha habido un error, prueba mas tarde`, ephemeral: true});
        }else {
            return interaction.reply({content: `La verificacion ha sido exitosa!!`, ephemeral: true});
        }
    },
};