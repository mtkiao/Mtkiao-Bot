const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed,MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('可以啟動客服單系統')
		.setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR)
		.addStringOption(option =>option.setName('客服單說明').setDescription('請寫出對此客服單的說明').setRequired(true))
		// .addRoleOption(option =>option.setName('身分組').setDescription('請寫出那些身分組為課服').setRequired(true))
		.addChannelOption(option => option.setName('頻道').setDescription('請選擇一個頻道成為開啟客服單的入口').setRequired(true)),
	async execute(interaction,client) {
		const { guild } = interaction;
		const Description = interaction.options.getString('客服單說明')
		const channel = interaction.options.getChannel('頻道')
		// const Role = interaction.options.getRole('身分組') 
		const bot = interaction.member.guild.members.cache.get(client.user.id)

		if (!bot.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply({ content: ":x:我沒有管理頻道的權限!", ephemeral: true })
        
        const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle(`客服單 - ${guild}`)
			.setDescription(Description)
			.setThumbnail(guild.iconURL({dynamic:true}))
        const Button = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('ticket_Button')
				.setLabel('開啟客服單')
				.setStyle(3)
				.setEmoji("🤖"),
		);
		channel.send({embeds: [embed], components: [Button] });
		interaction.reply({content:"已成功建立客服單!", ephemeral:true})
		
	},
};