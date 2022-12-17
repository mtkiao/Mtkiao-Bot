const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('可以刪除指定數量的訊息')
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_MESSAGES)
        .addIntegerOption(option =>option.setName('數量').setDescription('請寫出要清除的數量(數量上限為500)').setRequired(true)),
	async execute(interaction,client) {
        const quantity = interaction.options.getInteger('數量');
        const bot = interaction.member.guild.members.cache.get(client.user.id);

        if (!bot.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({ content: ":x:我沒有管理訊息的權限!", ephemeral: true });

        try{
            if (quantity > 500) return await interaction.reply({ content: `:x:數量上限為500!`, ephemeral: true });
            if (quantity < 1) return await interaction.reply({ content: `:x:數量至少為1!`, ephemeral: true });

            const messages = await interaction.channel.messages.fetch({
                limit: quantity,
            })

            await interaction.channel.bulkDelete(messages)
            
            const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(`訊息已刪除`)
                .setDescription(`已成功清除 **${messages.size}** 個訊息`)
                .addFields(
                    { name: '詳細資訊:', value: [
                        `命令使用者: ${interaction.user}`,
                        `是否已成功清除所有訊息: ${quantity == messages.size ? ':white_check_mark:' : ':x:'}`,
                        `清除訊息數量: ${messages.size}`,
                        `清除失敗數量: ${quantity - messages.size}`,
                    ].join('\n') },
                )
                .setFooter({ text: `${client.user.tag} (/purge)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
            await interaction.reply({ embeds: [embed] });
            console.log(interaction.user.tag, messages.size)
        } catch (e){
            await interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true });
        }
	},
};