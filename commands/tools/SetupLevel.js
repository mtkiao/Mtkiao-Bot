const { SlashCommandBuilder} = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { Find_data_guild_id } = require('../../utils/sqlite.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuplevel')
		.setDescription('可以開啟或關閉等級系統')
        .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR),
	async execute(interaction, client) {
        const bot = interaction.member.guild.members.cache.get(client.user.id);

        try{          
            let res = await Find_data_guild_id(interaction.guildId, "level")

            if (res == null){
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已開啟等級系統')
                    .setDescription(`已開啟等級系統`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否已開啟等級系統: :white_check_mark:`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/setuplevel)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                let insertQuery = db.prepare("INSERT INTO level VALUES (?)");
                insertQuery.run(bot.guild.id);
                insertQuery.finalize();
                interaction.reply({ embeds: [embed] });
            }
            else{
                const embed = new MessageEmbed()
                    .setColor(color=0xE693CB)
                    .setTitle('已關閉等級系統')
                    .setDescription(`已關閉等級系統`)
                    .addFields(
                        { name: '詳細資訊:', value: [
                            `命令使用者: ${interaction.user}`,
                            `是否已關閉等級系統: :white_check_mark:`,
                        ].join('\n') },
                    )
                    .setFooter({ text: `${client.user.tag} (/setuplevel)`, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                db.run("DELETE FROM level WHERE guild_id=?",bot.guild.id, err =>{
                    if(err) return console.log(err.message);
                });
                interaction.reply({ embeds: [embed] });
            }
        } catch (e){
            interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};