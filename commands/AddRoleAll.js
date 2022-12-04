const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions,MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give_all_role')
		.setDescription('可以給全部的成員添加指定的身分組')
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .addRoleOption(option =>option.setName('身分組').setDescription('請指定一個身分組').setRequired(true)),
	async execute(interaction,client) {
        if (client.cooldowns.has(interaction.user.id)) {
            interaction.reply({ content: "請稍後在嘗試!", ephemeral: true });
        } 
        else {
            const Role = interaction.options.getRole('身分組');
            const bot = interaction.member.guild.members.cache.get(client.user.id);
            if (!bot.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({ content: ":x:我沒有管理身分組的權限!", ephemeral: true });
            let success = 0;
    
            console.log(`Roles:${interaction.guild.members.cache.size}`)
    
            for (let i = 0; i < interaction.guild.members.cache.size; i++){
                if (interaction.guild.members.cache.map(m => m)[i].roles.cache.has(Role.id)) continue;
                interaction.guild.members.cache.map(m => m)[i].roles.add(Role);
                success += 1;
            }
            const embed = new MessageEmbed()
            .setColor(color=0xE693CB)
            .setTitle('已給予所有成員身分組')
            .setDescription(`已給予${success}個人${Role}身分組`)
            .setTimestamp()
            .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            interaction.reply({ embeds: [embed] });

            client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                client.cooldowns.delete(interaction.user.id);
            }, client.COOLDOWN_SECONDS * 1000);
        }
	},
};