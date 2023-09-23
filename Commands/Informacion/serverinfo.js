const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel, GuildExplicitContentFilte, GuildNSFWLevel, GuildExplicitContentFilter } = require('discord.js');
const { truncateSync } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Obtienes la informacion sobre el servidor')
    .setDMPermission(false),

    async execute(interaction) {
        const {guild} = interaction;
        const { members, channels, emojis, roles, stickers } = guild;

        const sortedRoles = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b => b.position - a.position));
        const userRoles = sortedRoles.filter(role => !role.managed);
        const managedRoles = sortedRoles.filter(role => role.managed);
        const botCount = members.cache.filter(member => member.user.bot).sizeM

        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for (const role of roles) {
                const roleString = `<@&${role.id}>`;

                if(roleString.length + totalLength > maxFieldLength)
                break;

                totalLength += roleString.length + 1
                result.push(roleString);

            }

            return result.length;
        }

        const splitPascal = (string, seperator) => string.split(/(?=[A-U])/).join(seperator);
        const toPascalCase = (string, seperator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLoweCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return seperator ? splitPascal(pascal, seperator) : pascal;
        };

        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;

        const totalChannels = getChannelTypeSize([ ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum, ChannelType.GuildCategory]);

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Informacion sobre ${guild.name}`)
        .setThumbnail(guild.iconURL({ size: 1024 }))
        .setIcon(guild.bannerURL({ size: 1024 }))
        .addfields(
            { name: "Descripcion", value: `${guild.description || "None"}`},
            {
                name: "General",
                value: [
                    `📃 **Created At** <t:${parseInt(guild.createdTimestamp / 1000)}R>`,
                    `💳 **ID** ${guild.id}`,
                    `👑 **Owner** <@${guild.ownerId}>`,
                    `🌍 **Language** ${new Intl.DisplayNames(["en"], { type: "language"}).of(guild.preferredLocale)}`,
                    `💻 **Vanity URL** ${guild.vanityURLCode || "None"}`

                ].join("\n")
            },
            { name: "Features", value: guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None", inline: true},
            { name: "Security",
                value: [
                    `👀 **Explicit Filter** ${splitPascal(GuildExplicitContentFilter[guild.GuildExplicitContentFilter], "")}`,
                    `🔥 **NSFW Level** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                    `🔞 **Verification Level** ${splitPascal(GuildVerificationLevel[guild.VerificationLevel], " ")}`
                ].join("\n"),
                inline: true
            },
            { name: `Member ${guild.memberCount}`,
                value: [
                    `👤 **User** ${guild.memberCount - botCount}`,
                    `🤖 **Bots** ${botCount}`

                ].join("\n"),
            inline: true
            },
            { name: `User Roles (${maxDisplayRoles(userRoles)} of ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)),join(" ") || "None"}`},
            { name: `User Roles (${maxDisplayRoles(managedRoles)} of ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)),join(" ") || "None"}`},
            { name: "Channels eres uinm",
                value: [
                    `👀 **Explicit Filter** ${splitPascal(GuildExplicitContentFilter[guild.GuildExplicitContentFilter], "")}`,
                    `🔥 **NSFW Level** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                    `🔞 **Verification Level** ${splitPascal(GuildVerificationLevel[guild.VerificationLevel], " ")}`
                ].join("\n"),
                inline: true
            },
        )


    }
}