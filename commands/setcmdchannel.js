const { Permissions, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('set_cmd_channel')
        .setDescription('可以設定或移除一個頻道為指令頻道')
        .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("可以設定一個頻道為指令頻道，打出來的訊息將會在指定秒數後刪除")
                .addChannelOption(option =>option.setName('頻道').setDescription('請指定一個頻道').setRequired(true))
                .addIntegerOption(option =>option.setName('秒數').setDescription('請寫出秒數(最多為120秒)').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("可以關閉已設定的指令頻道")
        ),
    async execute(interaction,client) {
        const Second = Number(interaction.options.getInteger('秒數'));
        const Channel = interaction.options.getChannel('頻道');
        const bot = interaction.member.guild.members.cache.get(client.user.id);
        if (!bot.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ content: ":x:我沒有管理訊息的權限!", ephemeral: true });

        let res = null
        await new Promise((resolve, reject) => {
            db.each("SELECT * FROM CommandChannel", function(err, row) {
                if(err) reject(err);
                if (row.guild_id == interaction.guildId){
                    res = row;
                    resolve(null);
                }
                else{
                    resolve(null);
                }
            });
        });

        if (interaction.options.getSubcommand() === "add") {
            if (!Second) return await interaction.reply({ content: `:x:不正確的類型`, ephemeral: true });
            if (Second > 120) return await interaction.reply({ content: `:x:秒數大於120`, ephemeral: true });
            if (Second < 1) return await interaction.reply({ content: `:x:秒數小於1`, ephemeral: true });

            if (res == null) {
                Channel.send(`這裡的所有訊息將會在${Second}秒後刪除`)
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已設定指令頻道')
                .setDescription(`:white_check_mark:已成功的將${Channel}設定為指令頻道`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.reply({ embeds: [embed] })
                .then(msg => {
                    setTimeout(function(){
                        var insertQuery = db.prepare("INSERT INTO CommandChannel VALUES (?,?,?)");
                        insertQuery.run(interaction.guildId, Channel.id, Second);
                        insertQuery.finalize();
                    }, 500);
                });
            }
            else {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已經有指令頻道!')
                .setDescription(`:x:這個群已經有設定<#${res.channel_id}>為指令頻道了!`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.reply({ embeds: [embed] });
            }
        }
        if (interaction.options.getSubcommand() === "remove") {
            if (res != null) {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已關閉指令頻道')
                .setDescription(`:x:已關閉指令頻道`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                db.run("DELETE FROM CommandChannel WHERE guild_id=?", interaction.guildId, err =>{
                    if(err) return console.log(err.message);
                });
                interaction.reply({ embeds: [embed] });
            }
            else {
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('沒有設定指令頻道!')
                .setDescription(`:x:這個群沒有設定指令頻道!`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.reply({ embeds: [embed] });
            }
        }
	},
};