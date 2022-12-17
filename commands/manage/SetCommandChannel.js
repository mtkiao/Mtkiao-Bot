const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Find_data_guild_id } = require('../../utils/sqlite.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('set_cmd_channel')
        .setDescription('可以設定或移除一個頻道為指令頻道')
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_MESSAGES)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("可以設定一個頻道為指令頻道，打出來的訊息將會在指定秒數後刪除")
                .addChannelOption(option =>option.setName('頻道').setDescription('請指定一個頻道').setRequired(true))
                .addIntegerOption(option =>option.setName('秒數').setDescription('請寫出秒數(最多為600秒)').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("可以關閉已設定的指令頻道")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("view")
                .setDescription("可以查看目前設定的頻道和秒數")
        ),
    async execute(interaction,client) {
        const Second = interaction.options.getInteger('秒數')
        const Channel = interaction.options.getChannel('頻道')
        const bot = interaction.member.guild.members.cache.get(client.user.id)

        if (!bot.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ content: ":x:我沒有管理訊息的權限!", ephemeral: true });

        let res = await Find_data_guild_id(interaction.guildId, "CommandChannel")

        if (interaction.options.getSubcommand() === "add") {
            if (Second > 600) return await interaction.reply({ content: `:x:秒數大於600`, ephemeral: true });
            if (Second < 1) return await interaction.reply({ content: `:x:秒數小於1`, ephemeral: true });

            if (res == null) {
                Channel.send(`這裡的所有訊息將會在${Second}秒後刪除`)
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已設定指令頻道')
                    .setDescription(`已成功的將${Channel}設定為指令頻道`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否成功設定: :white_check_mark:`,
                            `指定的頻道: ${Channel}`,
                            `指定的秒數: ${Second}s`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/set_cmd_channel)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()

                interaction.reply({ embeds: [embed] })

                setTimeout(() => {
                    let insertQuery = db.prepare("INSERT INTO CommandChannel VALUES (?,?,?)");
                    insertQuery.run(interaction.guildId, Channel.id, Second);
                    insertQuery.finalize();
                }, 1000);
            }
            else {
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已有指令頻道')
                    .setDescription(`這個群已有設定<#${res.channel_id}>為指令頻道`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否成功設定: :x:`,
                            `已指定的頻道: <#${res.channel_id}>`,
                            `已指定的秒數: ${res.Second}s`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/set_cmd_channel)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
        }
        if (interaction.options.getSubcommand() === "remove") {
            if (res != null) {
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已關閉指令頻道')
                    .setDescription(`已成功關閉指令頻道`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否成功關閉: :white_check_mark:`,
                            `先前設定的頻道: <#${res.channel_id}>`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/set_cmd_channel)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                db.run("DELETE FROM CommandChannel WHERE guild_id=?", interaction.guildId, err =>{
                    if(err) return console.log(err.message);
                });
                interaction.reply({ embeds: [embed] });
            }
            else {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('沒有設定指令頻道')
                .setDescription(`沒有設定任何指令頻道`)
                .addFields(
                    { name: '詳細資訊:', value: [
                        `命令使用者: ${interaction.user}`,
                        `是否成功關閉: :x:`,
                        `提示: 如果你想要設定指令頻道請使用/set_cmd_channel add`,
                    ].join('\n') },
                )
                .setFooter({ text: `${client.user.tag} (/set_cmd_channel)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
        }
        if (interaction.options.getSubcommand() === "view") {
            if (res != null) {
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已設定指令頻道')
                    .setDescription(`已設定<#${res.channel_id}>為指令頻道`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否已設定: :white_check_mark:`,
                            `設定的頻道: <#${res.channel_id}>`,
                            `設定的秒數: ${res.Second}s`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/set_cmd_channel)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
            else {
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('沒有設定指令頻道')
                    .setDescription(`沒有設定任何指令頻道`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否已設定: :x:`,
                            `提示: 如果你想要設定指令頻道請使用/set_cmd_channel add`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/set_cmd_channel)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
        }
	},
};