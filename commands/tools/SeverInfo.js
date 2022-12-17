const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('可以獲取伺服器的資訊'),
	async execute(interaction, client) {
        try{
            const { guild } = interaction;
            const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(`${guild.name} - 伺服器資訊`)
                .setThumbnail(guild.iconURL({dynamic:true}))
                .addFields(
                    { name: '伺服器🛡️', value: [
                        `名稱: ${guild.name}`,
                        `伺服器的擁有者: <@${guild.ownerId}>`,
                        `伺服器創建時間: ${moment(guild.createdTimestamp).format('YYYY-MM-DD HH:mm:ss')}`,
                        `伺服器的描述: ${guild.description ? guild.description : '沒有描述'}`,
                    ].join("\n")},

                    { name: '成員🙂', value: [
                        `成員: ${Number(guild.memberCount) - guild.members.cache.filter((m) => m.user.bot).size}`,
                        `機器人: ${guild.members.cache.filter((m) => m.user.bot).size}`,
                        `總人數: ${guild.memberCount}`
                    ].join("\n")},

                    { name: '頻道🛐', value: [
                        `文字頻道: ${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size}`,
                        `語音頻道: ${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size}`,
                        `討論串: ${guild.channels.cache.filter((c) => c.type === "GUILD_NEWS_THREAD" && "GUILD_PRIVATE_THREAD" && "GUILD_PUBLIC_THREAD").size}`,
                        `分類頻道: ${guild.channels.cache.filter((c) => c.type === "GUILD_CATEGORY").size}`,
                        `舞台: ${guild.channels.cache.filter((c) => c.type === "GUILD_STAGE_VOICE").size}`,
                        `更新通知頻道: ${guild.channels.cache.filter((c) => c.type === "GUILD_NEWS").size}`,
                        `頻道總數: ${guild.channels.cache.size}`
                    ].join("\n")},

                    { name: '表情符號🤣', value: [
                        `靜態表情符號總數: ${guild.emojis.cache.filter((e) => !e.animated).size}`,
                        `動態表情符號總數: ${guild.emojis.cache.filter((e) => e.animated).size}`,
                        `表情符號總數: ${guild.emojis.cache.size}`,
                        `貼圖總數: ${guild.stickers.cache.size}`
                    ].join("\n")}
                )
                .setFooter({ text: `${client.user.tag} (/serverinfo)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
            await interaction.reply({ embeds: [embed] });
        } catch (e){
            await interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};