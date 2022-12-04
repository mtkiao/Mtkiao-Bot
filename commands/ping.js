const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('可以獲取當前機器人的延遲狀況'),
	async execute(interaction,client) {
		const Date_now = Date.now()
        await interaction.deferReply();
        const ping = Date.now() - Date_now;
        await interaction.editReply(`機器人目前延遲:${ping}ms\nAPI目前延遲:${client.ws.ping}ms`);
	},
};