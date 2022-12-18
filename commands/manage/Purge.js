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

            let SuccessMessages = 0
            let TempQuantity = quantity
            for (let i = 0; i < Math.ceil(quantity / 100); i++) {
                if (TempQuantity <= 0) break
                let MessageLimit = TempQuantity > 100 ? 100 : TempQuantity

                const messages = await interaction.channel.messages.fetch({
                    limit: MessageLimit,
                })

                try{ 
                    await interaction.channel.bulkDelete(messages)
                } catch (e) {}

                TempQuantity -= MessageLimit
                SuccessMessages += messages.size
            }
            
            const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(`訊息已刪除`)
                .setDescription(`已成功清除 **${SuccessMessages}** 個訊息`)
                .addFields(
                    { name: '詳細資訊:', value: [
                        `命令使用者: ${interaction.user}`,
                        `是否已成功清除所有訊息: ${quantity == SuccessMessages ? ':white_check_mark:' : ':x:'}`,
                        `清除訊息數量: ${SuccessMessages}`,
                        `清除失敗數量: ${quantity - SuccessMessages}`,
                    ].join('\n') },
                )
                .setFooter({ text: `${client.user.tag} (/purge)`, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
            await interaction.reply({ embeds: [embed] })
        } catch (e){
            await interaction.reply({ content: `:x:發生錯誤! 原因:${e}`, ephemeral: true })
        }
	},
};