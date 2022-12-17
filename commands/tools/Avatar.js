const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('可以獲取指定成員的頭像')
        .addUserOption(option =>option.setName('成員').setDescription('指定一位成員')),
	async execute(interaction, client) {
        let member = interaction.options.getUser('成員')
        if (!member) member = interaction.member
        const target = interaction.guild.members.cache.get(member.id)

        await interaction.deferReply()
        try{
            const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(`${target.user.tag} - 頭像`)
                .setImage(`${target.user.displayAvatarURL()}?size=512`)
                .setFooter({ text: `${client.user.tag} (/avatar)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()

            await interaction.editReply({ embeds: [embed] });
        } catch (e){
            await interaction.editReply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};