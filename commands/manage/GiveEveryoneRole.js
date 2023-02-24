const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { CheckRoleIsHigher } = require('../../utils/tool.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give_everyone_role')
		.setDescription('可以給全部的成員添加指定的身分組')
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_ROLES)
        .addRoleOption(option =>option.setName('身分組').setDescription('請指定一個身分組').setRequired(true)),
	async execute(interaction,client) {
        if (client.cooldowns.has(interaction.user.id)) {
            interaction.reply({ content: "請稍後再嘗試!", ephemeral: true });
        } 
        else {
            const Role = interaction.options.getRole('身分組')
            const bot = interaction.member.guild.members.cache.get(client.user.id)
            
            if (!bot.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return interaction.reply({ content: ":x:我沒有管理身分組的權限!", ephemeral: true });
            if (Role.name == "@everyone" || Role.name == "@here") return await interaction.reply({ content: `:x:不可設定為${Role}`, ephemeral: true });
            if (Role.tags != null) return await interaction.reply({ content: ":x:不可設定為機器人身分組", ephemeral: true });
            if (!CheckRoleIsHigher(interaction, bot._roles, Role.rawPosition)) return await interaction.reply({ content: ":x:不可設定比我高的身分組", ephemeral: true });

            let successes = 0;
    
            for (let i = 0; i < interaction.guild.members.cache.size; i++){
                if (interaction.guild.members.cache.map(m => m)[i].roles.cache.has(Role.id)) continue;
                interaction.guild.members.cache.map(m => m)[i].roles.add(Role)
                successes += 1;
            }

            const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle('已給予所有成員身分組')
                .setDescription(`已給予${successes}個人${Role}身分組`)
                .addFields(
                    { name: '詳細資訊:', value: [
                        `命令使用者: ${interaction.user}`,
                        `設定身分組: ${Role}`,
                        `成功設定數量: ${successes}`,
                        `失敗數量: ${interaction.guild.members.cache.size - successes}`,
                    ].join('\n') },
                )
                .setFooter({ text: `${client.user.tag} (/give_everyone_role)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
            interaction.reply({ embeds: [embed] });

            client.cooldowns.set(interaction.user.id, true);
            setTimeout(() => {
                client.cooldowns.delete(interaction.user.id);
            }, interaction.guild.members.cache.lenght * 2000);
        }
	},
};