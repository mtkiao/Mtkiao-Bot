const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scan')
		.setDescription('可以對此群進行安全掃描'),
	async execute(interaction,client) {
        const { guild } = interaction;
        const bot = interaction.member.guild.members.cache.get(client.user.id);

        try{
            const embed = new MessageEmbed();
            embed.setColor(color=0xE693CB);
            embed.setTitle('掃描結果');
            embed.setDescription(`掃描結果已經出爐啦!`);
            embed.setTimestamp()
            embed.setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            let res = null
            await new Promise((resolve, reject) => {
                db.each("SELECT * FROM antinuke", function(err, row) {
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
            if (res != null){
                embed.addFields({ name: '是否已開啟群保護', value: "```diff\n+ " + "有" + "\n```"});
            }
            else{
                embed.addFields({ name: '是否已開啟群保護', value: "```diff\n- " + "沒有" + "\n```"});
            }

            if (!bot.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
                embed.addFields({ name: '我是否有管理員權限', value: "```diff\n- " + "沒有" + "\n```"});
            }
            else{
                embed.addFields({ name: '我是否有管理員權限', value: "```diff\n+ " + "有" + "\n```"});
            }

            let danger_permissions = []
            let everyone_role = guild.roles.everyone;

            if (everyone_role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) danger_permissions.push("管理員權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) danger_permissions.push("踢人權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) danger_permissions.push("停權權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) danger_permissions.push("管理頻道權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) danger_permissions.push("檢視審核日誌權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) danger_permissions.push("管理訊息權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) danger_permissions.push("管理暱稱權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) danger_permissions.push("管理身分組權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) danger_permissions.push("管理WebHook權限")

            if (danger_permissions.length != 0){
                embed.addFields({ name: 'everyone是否有危險權限', value: "```diff\n- " + "有，危險權限列表:\n-" + danger_permissions.join(", ") + "\n```"});
            }
            else{
                embed.addFields({ name: 'everyone是否有危險權限', value: "```diff\n+ " + "沒有" + "\n```"});
            }

            interaction.reply({ embeds: [embed] });
            
        } catch (e){
            console.log(e);
            interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};