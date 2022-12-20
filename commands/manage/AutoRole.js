const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Find_data_guild_id } = require('../../utils/sqlite.js');
const { CheckRoleIsHigher } = require('../../utils/tool.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('auto_role')
        .setDescription('可以設定或關閉進來的新成員給予指定身分組')
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("enable")
                .setDescription("可以啟用自動給予的身分組功能")
                .addRoleOption(option => option.setName('身分組').setDescription('請指定一個身分組').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("disable")
                .setDescription("可以禁用自動給予身分組功能")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("view")
                .setDescription("可以查看目前是否有無設定")
        ),
    async execute(interaction,client) {
        const Role = interaction.options.getRole('身分組');
        const bot = interaction.member.guild.members.cache.get(client.user.id);
        if (!bot.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return await interaction.reply({ content: ":x:我沒有管理身分組的權限!", ephemeral: true });

        let res = await Find_data_guild_id(interaction.guildId, "joinrole")
        
        if (interaction.options.getSubcommand() === "enable") {
            if (res == null) {
                if (Role.name == "@everyone" || Role.name == "@here") return await interaction.reply({ content: `:x:不可設定為${Role}`, ephemeral: true });
                if (Role.tags != null) return await interaction.reply({ content: ":x:不可設定為機器人身分組", ephemeral: true });
                if (!CheckRoleIsHigher(interaction, bot._roles, Role.rawPosition)) return await interaction.reply({ content: ":x:不可設定比我高的身分組", ephemeral: true });

                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已啟用自動給予身分組功能')
                    .setDescription(`已將${Role}設定為加入時所給予的身分組`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `設定身分組: ${Role}`,
                            `是否成功設定: :white_check_mark:`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/auto_role)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                var insertQuery = db.prepare("INSERT INTO joinrole VALUES (?,?)");
                insertQuery.run(interaction.guildId, Role.id);
                insertQuery.finalize();
                await interaction.reply({ embeds: [embed] })
            }
            else {
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已有設定自動給予身分組功能')
                    .setDescription(`已有設定<@&${res.Role_id}>為加入時所給予的身分組`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `設定身分組: ${Role}`,
                            `是否成功設定: :x:`,
                            `提示: 如要更改請先使用\"/auto_role disable\"來禁用自動給予身分組功能`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/auto_role)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                await interaction.reply({ embeds: [embed] });
            }
        }
        if (interaction.options.getSubcommand() === "disable") {
            if (res != null) {
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已禁用自動給予身分組功能')
                    .setDescription(`已禁用給予新成員身分組功能`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `原先設定身分組: <@&${res.Role_id}>`,
                            `是否成功禁用: :white_check_mark:`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/auto_role)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                db.run("DELETE FROM joinrole WHERE guild_id=?", interaction.guildId, err =>{
                    if(err) return console.log(err.message);
                });
                await interaction.reply({ embeds: [embed] });
            }
            else {
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('尚未啟用自動給予身分組功能')
                    .setDescription(`尚未啟用自動給予身分組功能`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否成功禁用: :x:`,
                            `提示: 如要啟用請先使用\"/auto_role enable\"來啟用自動給予身分組功能`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/auto_role)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                await interaction.reply({ embeds: [embed] });
            }
        }
        if (interaction.options.getSubcommand() === "view") {
            if (res == null) {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('尚未啟用自動給予身分組')
                .setDescription(`目前尚未啟用自動給予身分組`)
                .addFields(
                    { name: '詳細資訊:', value: [
                        `命令使用者: ${interaction.user}`,
                        `是否有啟用: :x:`,
                        `提示: 如要啟用請使用\"/auto_role enable\"來啟用自動給予身分組功能`,
                    ].join('\n') },
                )
                .setFooter({ text: `${client.user.tag} (/auto_role)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] })
            }
            else {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已有啟用自動給予身分組')
                .setDescription(`已有設定自動給予身分組功能`)
                .addFields(
                    { name: '詳細資訊:', value: [
                        `命令使用者: ${interaction.user}`,
                        `是否有啟用: :white_check_mark:`,
                        `設定身分組: <@&${res.Role_id}>`,
                    ].join('\n') },
                )
                .setFooter({ text: `${client.user.tag} (/auto_role)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                await interaction.reply({ embeds: [embed] });
            }
        }
	},
};