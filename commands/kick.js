const { SlashCommandBuilder} = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('可以踢出指定的成員')
        .setDefaultMemberPermissions(Permissions.FLAGS.KICK_MEMBERS)
        .addUserOption(option =>option.setName('成員').setDescription('指定一位成員').setRequired(true))
        .addStringOption(option => option.setName('原因').setDescription('請寫出踢出此成員的原因(可不寫)')),
	async execute(interaction,client) {
        const member = interaction.options.getUser('成員');
        const reason = interaction.options.getString('原因');
        const bot = interaction.member.guild.members.cache.get(client.user.id);
        const memberTarger = interaction.guild.members.cache.get(member.id);
        if (!bot.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({ content: ":x:我沒有踢人的權限!", ephemeral: true });
        try{
            const embed = new MessageEmbed()
            .setColor(color=0xE693CB)
            .setTitle('成員被踢出')
            .setDescription(`${interaction.user}使用了命令"/kick"踢出了${member}`)
            .setTimestamp()
            .setFooter({ text: `原因:${reason}`, iconURL: interaction.user.displayAvatarURL() })
            memberTarger.kick(this.reason=`${reason}  命令使用者:${interaction.user}`);
            interaction.reply({ embeds: [embed] });
        } catch (e){
            if (e == "TypeError: Cannot read properties of undefined (reading 'kick')") {
                interaction.reply({ content: `:x:所指定的成員:${member}不存在!`, ephemeral: true });
            }
            else{
                interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
            }
        }
	},
};