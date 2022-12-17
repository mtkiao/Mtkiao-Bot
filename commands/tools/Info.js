const { SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('可以獲取指定成員的訊息')
        .addUserOption(option => option.setName('成員').setDescription('指定一位成員').setRequired(true)),
	async execute(interaction, client) {
        const member = interaction.options.getUser('成員')
        const Membertarget = interaction.guild.members.cache.get(member.id)

        try{
            await interaction.deferReply()
            let usernick = `${Membertarget.nickname == null ? "沒有暱稱" : Membertarget.nickname}`

            const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(`${Membertarget.user.tag} - 成員資訊`)
                .setThumbnail(Membertarget.user.displayAvatarURL())
                .addFields(
                    { name: '名稱:', value: `${Membertarget.user.username}`, inline: true},
                    { name: '後四碼:', value: `${Membertarget.user.discriminator}`, inline: true},
                    { name: '在此群的暱稱:', value: `${usernick}` , inline: true},
                    { name: 'ID:', value: `${Membertarget.user.id}`, inline: true},
                    { name: '加入伺服器時間:', value: moment(Membertarget.joinedTimestamp).format('YYYY-MM-DD HH:mm:ss'),inline: true},
                    { name: '是否為機器人:', value: `${Membertarget.user.bot}`},
                    { name: '擁有的身分組:', value: `${Membertarget.roles.cache.map(r => r).join(" ").replace("@everyone"," ") || "None"}`},
                    )
                .setFooter({ text: `${client.user.tag} (/info)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
            await interaction.editReply({ embeds: [embed] });
        } catch (e){
            await interaction.editReply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};