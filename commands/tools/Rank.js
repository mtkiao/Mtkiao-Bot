const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Find_data_guild_id, Find_data_level } = require('../../utils/sqlite.js');
const Discord = require('discord.js');
const canvacord = require("canvacord");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('可以查詢成員的等級資訊(需開啟等級系統)')
        .addUserOption(option => option.setName('成員').setDescription('指定一位成員')),
	async execute(interaction, client) {
        let member = interaction.options.getUser('成員')
        if (!member) member = interaction.user
        else member = interaction.guild.members.cache.get(member.id).user

        if (member.bot) return await interaction.reply(":x:機器人是不會有等級的")

        try{          
            let res = await Find_data_guild_id(interaction.guildId, "level")

            if (res == null){
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('沒有開啟等級系統')
                    .setDescription(`沒有開啟等級系統`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否已開啟等級系統: :x:`,
                            `提示: 請使用 /setuplevel 開啟等級系統`
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/rank)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
            else{
                res = await Find_data_level(`${interaction.guildId}.${member.id}`, "level_2")

                if (!res) {
                    const embed = new MessageEmbed()
                        .setColor(color=0xE693CB)
                        .setTitle('沒有資訊')
                        .setDescription(`該成員並沒有等級資訊`)
                        .addFields(
                            { name: '詳細資訊:', value: [
                                `命令使用者: ${interaction.user}`,
                                `是否已開啟等級系統: :white_check_mark:`,
                                `提示: 如果要獲取該成員等級資訊, 請讓該成員發送一則訊息`
                            ].join('\n') },
                        )
                        .setFooter({ text: `${client.user.tag} (/rank)`, iconURL: client.user.displayAvatarURL() })
                        .setTimestamp()
                    interaction.reply({ embeds: [embed] });
                }
                else{
                    const Rank = new canvacord.Rank()
                        .setAvatar(member.displayAvatarURL({ dynamic: false, format: "png" }))
                        .setCurrentXP(res.level)
                        .setRequiredXP(res.level_next)
                        .setLevel(res.level_large)
                        .setStatus("online")
                        .setProgressBar("#FFFFFF","COLOR")
                        .setUsername(member.username)
                        .setDiscriminator(member.discriminator)
                    Rank.build()
                    .then(data => {
                        canvacord.write(data, "./Temp/RankCard.png");
                        const attachment = new Discord.MessageAttachment(data, "./Temp/RankCard.png");
                        interaction.reply({ files: [attachment] });
                    })
                } 
            }       
        } catch (e){
            interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};