const { SlashCommandBuilder} = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuplevel')
		.setDescription('可以開啟或關閉等級系統')
        .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR),
	async execute(interaction,client) {
        const bot = interaction.member.guild.members.cache.get(client.user.id);
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
                .setTitle('已開啟等級系統')
                .setDescription(`:white_check_mark:已開啟等級系統`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                var insertQuery = db.prepare("INSERT INTO Level VALUES (?)");
                insertQuery.run(bot.guild.id);
                insertQuery.finalize();
                interaction.reply({ embeds: [embed] });
            }
            else{
                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已關閉等級系統')
                .setDescription(`:x:已關閉等級系統`)
                .setTimestamp()
                .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                db.run("DELETE FROM Level WHERE guild_id=?",bot.guild.id, err =>{
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