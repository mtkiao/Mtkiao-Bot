const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions,MessageEmbed } = require('discord.js');
const { Find_data_guild_id } = require("../Command_Library/sqlite");
const ms = require("ms")

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('antispam')
		.setDescription('可以讓群開啟、關閉或設定防刷頻(beta版)')
        .addIntegerOption(option =>option.setName('訊息數量').setDescription('請寫出5秒內能發送多少訊息'))
        .addStringOption(option =>option.setName('禁言時間').setDescription('如果有成員刷頻被偵測到將禁言多少時間 例如: 1m'))
        .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR),
	async execute(interaction,client) {
        const MessageCount = interaction.options.getInteger('訊息數量');
        const timeout = interaction.options.getInteger('禁言時間');
        const bot = interaction.member.guild.members.cache.get(client.user.id);
        if (!bot.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: ":x:我沒有管理員權限!", ephemeral: true });

        try{          
            let res = await Find_data_guild_id(interaction.guildId, "antispam");
            if (res == null){
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已開啟防刷頻保護')
                .setDescription(`:white_check_mark:已開啟防刷頻保護，5秒內最多能發送${MessageCount}則訊息`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                var insertQuery = db.prepare("INSERT INTO antispam VALUES (?,?,?)");
                insertQuery.run(bot.guild.id, MessageCount, 5);
                insertQuery.finalize();
                interaction.reply({ embeds: [embed] });
            }
            else{
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已關閉防刷頻保護')
                .setDescription(`:x:已關閉防刷頻保護。`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                db.run("DELETE FROM antispam WHERE guild_id=?", interaction.guildId, err =>{
                    if(err) return console.log(err.message);
                });
                interaction.reply({ embeds: [embed] });
            }
            
        } catch (e){
            console.log(e);
            interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};