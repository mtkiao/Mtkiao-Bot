const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions,MessageEmbed } = require('discord.js');
const { Find_data_guild_id } = require("../../utils/sqlite.js");
const ms = require("ms")

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('antispam')
		.setDescription('可以讓群開啟、關閉防刷頻')
        .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR)
        .addIntegerOption(option =>option.setName('時間').setDescription('請寫出在指定訊息數量內持續幾秒'))
        .addIntegerOption(option =>option.setName('訊息數量').setDescription('請寫出指定秒數內能發送多少訊息'))
        .addStringOption(option =>option.setName('禁言時間').setDescription('如果有成員刷頻被偵測到將禁言多少時間 例如: 1m')),
	async execute(interaction,client) {
        const MessageCount = interaction.options.getInteger('訊息數量')
        const timeout = interaction.options.getString('禁言時間')
        const time = interaction.options.getInteger('時間')
        const bot = interaction.member.guild.members.cache.get(client.user.id)

        if (!bot.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: ":x:我沒有管理員權限!", ephemeral: true });

        try{          
            let res = await Find_data_guild_id(interaction.guildId, "antispam")

            if (res == null){
                const timeoutMs = ms(timeout);

                if (!timeoutMs) return interaction.reply({ content: ":x:請輸入有效的時間格式!", ephemeral: true });
                if (time < 1) return interaction.reply({ content: ":x:秒數不得為小於1", ephemeral: true });
                if (time > 60) return interaction.reply({ content: ":x:秒數不得為大於60", ephemeral: true });

                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已開啟防刷頻保護')
                    .setDescription(`已開啟防刷頻保護，${time}秒內最多能發送${MessageCount}則訊息`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否成功設定: :white_check_mark:`,
                            `設定的訊息數: ${MessageCount}`,
                            `設定的禁言時間: ${timeout}`,
                            `設定的秒數: ${time}s`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/antispam)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()

                let insertQuery = db.prepare("INSERT INTO antispam VALUES (?,?,?,?)");
                insertQuery.run(interaction.guildId, MessageCount, timeoutMs, time);
                insertQuery.finalize();
                interaction.reply({ embeds: [embed] });
            }
            else{
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已關閉防刷頻保護')
                    .setDescription(`已關閉防刷頻保護`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否成功關閉: :white_check_mark:`,
                            `之前設定的訊息數: ${res.time}`,
                            `之前設定的禁言時間: ${res.mutetime / 1000}s`,
                            `之前設定的秒數: ${res.spamtime}s`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/antispam)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                db.run("DELETE FROM antispam WHERE guild_id=?", interaction.guildId, err =>{
                    if(err) return console.log(err.message);
                });
                interaction.reply({ embeds: [embed] });
            }
            
        } catch (e){
            interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true })
        }
	},
};