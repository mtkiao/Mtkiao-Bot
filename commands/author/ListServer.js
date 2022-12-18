const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list_server')
		.setDescription('可以列出所以群組的狀況(僅限mtkiao129使用)'),
	async execute(interaction,client) {
        if (interaction.user.id != 608282025161654272) return

        const GuildsID = client.guilds.cache.map(guild => guild.id)
        const GuildsName = client.guilds.cache.map(guild => guild.name)
        const GuildsOwner = client.guilds.cache.map(guild => guild.ownerId)

        const backId = 'back'
        const forwardId = 'forward'
        const backButton = new MessageButton({
          style: 'SECONDARY',
          label: '',
          emoji: '⬅️',
          customId: backId
        })
        const forwardButton = new MessageButton({
          style: 'SECONDARY',
          label: '',
          emoji: '➡️',
          customId: forwardId
        })
        
        const { member, channel } = interaction

        let ServerList = [GuildsID, GuildsName, GuildsOwner]

        /**
         * Creates an embed with guilds starting from an index.
         * @param {number} start The index to start from.
         * @returns {Promise<MessageEmbed>}
         */
        const generateEmbed = async start => {
            const current = ServerList[0].slice(start, start + 5)

            let embed = new MessageEmbed()
                .setTitle('機器人伺服器列表')
                .setColor(0xE693CB)
                .setDescription(`正在顯示 **${current.length != 0 ? start + 1 : start} - ${start + current.length}** 個伺服器 共 **${ServerList[0].length}** 個伺服器`)
                .setFooter({ text: `${client.user.tag} (/list_server)`, iconURL: client.user.displayAvatarURL() })

            for (let i = start; i < start + 5; i++) {
                if (!ServerList[0][i]) break
                embed.addFields({
                    name: `伺服器${i + 1}:`, value: [
                        `名字: **${ServerList[1][i]}**`,
                        `ID: **${ServerList[0][i]}**`,
                        `擁有者: <@${ServerList[2][i]}>`,
                    ].join('\n')
                })
            }

            return embed
        }
        
        const canFitOnOnePage = ServerList[0].length <= 5

        await interaction.reply('Ok')

        const embedMessage = await channel.send({
          embeds: [await generateEmbed(0)],
          components: canFitOnOnePage
            ? []
            : [new MessageActionRow({components: [forwardButton]})]
        })

        if (canFitOnOnePage) return
        
        const collector = embedMessage.createMessageComponentCollector({
          filter: ({user}) => user.id === member.id
        })
        
        let currentIndex = 0
        collector.on('collect', async interaction => {
            interaction.customId === backId ? (currentIndex -= 5) : (currentIndex += 5)
            await interaction.update({
                embeds: [await generateEmbed(currentIndex)],
                components: [
                new MessageActionRow({
                    components: [
                    ...(currentIndex ? [backButton] : []),
                    ...(currentIndex + 5 < ServerList[0].length ? [forwardButton] : [])
                    ]
                })
                ]
            })
        })


	},
};