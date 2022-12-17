const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { Find_data_guild_id } = require('../../utils/sqlite.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scan')
		.setDescription('可以對此群進行安全掃描'),
	async execute(interaction,client) {
        const { guild } = interaction;
        const bot = interaction.member.guild.members.cache.get(client.user.id);

        try{
            const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('掃描結果')
                .setDescription(`掃描結果已出爐`)
                .setFooter({ text: `${client.user.tag} (/scan)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()

            let res = await Find_data_guild_id(interaction.guildId, "antinuke")

            embed.addFields({ name: '是否已開啟群保護', value: "```diff\n" + `${res != null ? "+ 有" : "- 沒有"}` + "\n```"})
            embed.addFields({ name: '我是否擁有管理員權限', value: "```diff\n" + `${!bot.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ? "- 沒有" : "+ 有"}` + "\n```"})

            let danger_permissions = []
            let everyone_role = guild.roles.everyone

            if (everyone_role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) danger_permissions.push("管理員權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) danger_permissions.push("踢人權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) danger_permissions.push("停權權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) danger_permissions.push("管理頻道權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) danger_permissions.push("檢視審核日誌權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) danger_permissions.push("管理訊息權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) danger_permissions.push("管理暱稱權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) danger_permissions.push("管理身分組權限")
            if (everyone_role.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) danger_permissions.push("管理WebHook權限")

            embed.addFields({ name: 'everyone是否有危險權限', value: "```diff\n" + `${danger_permissions.length != 0 ? `有，危險權限列表:\n- ${danger_permissions.join(", ")}` : "+ 沒有"}` + "\n```"})

            await interaction.reply({ embeds: [embed] });
        } catch (e){
            await interaction.reply({ content: `:x:發生錯誤! 原因: ${e}`, ephemeral: true })
        }
	},
};