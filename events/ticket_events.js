const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports ={
    name:"interactionCreate",
    async execute(client,interaction){
        if (!interaction.isButton()) return;
        const { guild, member, customId, channel } = interaction;
        if(!["ticket_Button"].includes(customId)) return;
        const target = interaction.guild.members.cache.get(member.id);
        const ID = Math.floor(Math.random() * 900000) + 10000;
        await guild.channels.create(`🎟️客服單｜${member.user.username} - ${ID}`, {
            parent: channel.parentId,
            type: "GUILD_TEXT",
            permissionOverwrites:[
                {
                    id: member.id,
                    allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                },
                {
                    id: guild.roles.everyone.id,
                    deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                },
            ],
        })
        .then(async (channel) => {

        const embed = new MessageEmbed()
        embed.setTitle(`🎟️客服單｜${member.user.username} - ${ID}`)
        embed.setDescription(`${interaction.user.tag}(${interaction.user.id})開啟了客服單!請等待客服人員來進行協助。`)
        embed.setThumbnail(target.user.displayAvatarURL())
        embed.setColor(color=0xE693CB)
        const Button = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('Close_ticket_Button')
				.setLabel('關閉客服單')
				.setStyle(3)
				.setEmoji("❌"),
		);
        channel.send({embeds: [embed],components:[Button]})

        await channel.send({ content: `${member}您的客服單已經創建好了!`})
            .then((m) => {
                setTimeout(() =>{
                    m.delete().catch(() => {});

                }, 1 * 5000)
            })

        interaction.reply({content: `客服單已創建成功!${channel}`, ephemeral: true })
        })
    }   
}
