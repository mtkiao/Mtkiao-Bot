const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('typing')
		.setDescription('持續顯示正在輸入10秒(?'),
	async execute(interaction,client) {
        await interaction.reply({ content: "start typing 10s", ephemeral: true });
        interaction.channel.sendTyping()
	},
};