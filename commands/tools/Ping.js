const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('可以獲取當前機器人的延遲狀況'),
	async execute(interaction,client) {
        await interaction.deferReply()
        await interaction.editReply(`API目前延遲: ${client.ws.ping}ms`);
	},
};