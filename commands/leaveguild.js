const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaveguild')
		.setDescription('可以讓機器人離開指定的群組(僅限mtkiao129使用)')
        .addStringOption(option =>option.setName('伺服器id').setDescription('請寫出伺服器的id').setRequired(true)),
	async execute(interaction,client) {
        if (interaction.user.id != 608282025161654272) return await interaction.reply("Nope");
        const guild_id = interaction.options.getString('伺服器id');
        client.guilds.fetch(guild_id)
	        .then(guild => guild.leave())
        await interaction.reply(`已成功退出群組: ${guild_id}`)
	}
};