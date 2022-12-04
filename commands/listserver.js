const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listserver')
		.setDescription('可以列出所以群組的狀況(僅限mtkiao129使用)'),
	async execute(interaction,client) {
        if (interaction.user.id != 608282025161654272) return interaction.reply("Nope");

        const embed = new MessageEmbed()
        embed.setColor(color=0xE693CB)
        embed.setTitle(`伺服器列表`)

        const GuildsID = client.guilds.cache.map(guild => guild.id);
        const GuildsName = client.guilds.cache.map(guild => guild.name);
        const GuildsOwner = client.guilds.cache.map(guild => guild.ownerId);

        for (var i in GuildsName){
            embed.addFields({ name: '伺服器:', value: `名稱: **${GuildsName[i]}**\nID: **${GuildsID[i]}**\n擁有者: **<@${GuildsOwner[i]}>**`})
        }

        await interaction.reply({ embeds: [embed] });
	},
};