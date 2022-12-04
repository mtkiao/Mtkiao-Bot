const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const canvacord = require("canvacord");

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('可以查詢成員的等級資訊(需開啟等級系統)')
        .addUserOption(option =>option.setName('成員').setDescription('指定一位成員')),
	async execute(interaction,client) {
        let member = interaction.options.getUser('成員');
        if (!member){
            member = interaction.user;
        }
        else{
            member = interaction.guild.members.cache.get(member.id).user;
        }
        if (member.bot) return await interaction.reply(":x:機器人是不會有等級的")
        try{          
            let res = null
            await new Promise((resolve, reject) => {
                db.each("SELECT * FROM Level", function(err, row) {
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
            if (res == null){
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(':x:沒有開啟等級系統')
                .setDescription(`此群並沒有開啟等級系統，請輸入/setupLevel來開啟等級系統!`)
                .setTimestamp()
                interaction.reply({ embeds: [embed] });
            }
            else{
                res = null
                await new Promise((resolve, reject) => {
                    db.each("SELECT * FROM Level_2", function(err, row) {
                        if(err) reject(err);
                        if (row.user_id == `${member.id}_${interaction.guildId}`){
                            res = row;
                            resolve(null);
                        }
                        else{
                            resolve(null);
                        }
                    });
                });
                if (!res) {
                    const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('沒有資訊')
                    .setDescription(`:x:該成員並沒有等級資訊!`)
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
            console.log(e);
            interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};