const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('入群封鎖')
        .setDefaultMemberPermissions(Permissions.FLAGS.BAN_MEMBERS)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("view")
                .setDescription("可以查看哪些用戶已添加黑名單(入群封鎖)")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("可以對指定用戶添加黑名單(入群封鎖)")
                .addStringOption(option =>option.setName('成員id').setDescription('請寫出成員的id').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("可以對指定用戶解除黑名單(入群封鎖)")
                .addStringOption(option =>option.setName('成員id').setDescription('請寫出成員的id').setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove_all")
                .setDescription("可以一件刪除黑名單(入群封鎖)裡的用戶id")
        ),
	async execute(interaction,client) {
        /* TODO
            添加註解
        */
        const BlackListPath = './Data/blacklist.json'
        const member = interaction.options.getString('成員id')
        const bot = interaction.member.guild.members.cache.get(client.user.id);

        if (interaction.options.getSubcommand() === "add") {
            if (!Number(member)) return interaction.reply({ content: `:x:請輸入數字`, ephemeral: true });
            if (member.length >= 22) return interaction.reply({ content: `:x:請輸入小於長度22的數字`, ephemeral: true });
            if (member.length <= 5) return interaction.reply({ content: `:x:請輸入大於長度5的數字`, ephemeral: true });
            if (!bot.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({ content: ":x:我沒有封鎖的權限!", ephemeral: true });

            fs.readFile(BlackListPath, (err, Guild) => {
                if (err) return console.error(err)
                let user = Guild.toString()
                user = JSON.parse(user)

                if (!user[interaction.guildId]) user[interaction.guildId] = []

                for (i of user[interaction.guildId]) {
                    if (i == member) return interaction.reply({ content: `:x:此用戶ID: ${member} 已經添加在黑名單(入群封鎖)裡了`, ephemeral: true })
                }

                if (user[interaction.guildId].length > 100) return interaction.reply({ content: ":x:人數已達到限制(最高100個人)", ephemeral: true })
                else user[interaction.guildId].push(member)
        
                let strJSON = JSON.stringify(user, null, 2);
                fs.writeFile(BlackListPath, strJSON, function (err) {
                    if (err) return console.error(err)

                    console.log(`${interaction.user.tag}添加用戶id: ${member}`)
                    interaction.reply(`${interaction.user}已成功添加用戶id: ${member}`);
                })
            })
        }
        else if (interaction.options.getSubcommand() === "view") {
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
            
            const { member, channel } = interaction;
            let blacklist_user = null
            blacklist_user = await new Promise((resolve, reject) => {
                fs.readFile(BlackListPath, (err, Guild) => {
                    if (err) reject(err)

                    blacklist_user = Guild.toString()
                    blacklist_user = JSON.parse(blacklist_user)
                    blacklist_user = blacklist_user[interaction.guildId]
                    if (!blacklist_user) blacklist_user = []
                    resolve(blacklist_user)
                })
            })
            /**
             * Creates an embed with guilds starting from an index.
             * @param {number} start The index to start from.
             * @returns {Promise<MessageEmbed>}
             */
            const generateEmbed = async start => {
                const current = blacklist_user.slice(start, start + 5)
                return new MessageEmbed({
                    title: '黑名單(入群封鎖)的列表',
                    description: `正在顯示 **${current.length != 0 ? start + 1 : start} - ${start + current.length}** 個用戶ID 共**${blacklist_user.length}**個用戶ID`,
                    color: 0xE693CB,
                    footer: {
                        text: `${client.user.tag} (/BlackList)`, iconURL: client.user.displayAvatarURL() 
                    },
                    fields: await Promise.all(
                        current.map(async length => ({
                            name: `ID:`,
                            value: `**${length}**`
                        }))
                    ),
                })
            }
            
            const canFitOnOnePage = blacklist_user.length <= 5

            if (!interaction.channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.SEND_MESSAGES | Permissions.FLAGS.VIEW_CHANNEL)) return await interaction.reply({ content: ":x:我沒有在此頻道發送訊息的權限!", ephemeral: true });
            await interaction.reply('Done')

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
                        ...(currentIndex + 5 < blacklist_user.length ? [forwardButton] : [])
                        ]
                    })
                    ]
                })
            })
        }
        else if (interaction.options.getSubcommand() === "remove") {
            fs.readFile(BlackListPath, function (err, Guild) {
                if (err) return console.error(err)

                let user = Guild.toString()
                user = JSON.parse(user)
                
                if (!user[interaction.guildId] || user[interaction.guildId].length <= 0) return interaction.reply({ content: ":x:這個群並沒有添加黑名單(入群封鎖)", ephemeral: true })
                
                let IsDelete = false;
                for (const i = 0; i < user[interaction.guildId].length; i++) {
                    if (member == user[interaction.guildId][i]) {
                        user[interaction.guildId].splice(i, 1);
                        IsDelete = true;
                    }
                }

                let strJSON = JSON.stringify(user);
                fs.writeFile(BlackListPath, strJSON, (err) => {
                    if (err) return console.error(err)
                    if (IsDelete){
                        console.log(`${interaction.user.tag}刪除用戶id: ${member}`);
                        interaction.reply(`${interaction.user}已成功刪除用戶id: ${member}`);
                    }
                    else {
                        interaction.reply(`:x:找不到此用戶ID: ${member}`);
                    }
                })
            })
        }
        else if (interaction.options.getSubcommand() === "remove_all") {
            fs.readFile(BlackListPath, function (err, Guild) {
                if (err) return console.error(err)

                let user = Guild.toString()
                user = JSON.parse(user)
                
                if (!user[interaction.guildId] || user[interaction.guildId].length <= 0) return interaction.reply({ content: ":x:這個群並沒有添加黑名單(入群封鎖)", ephemeral: true })

                user[interaction.guildId] = [];

                var str = JSON.stringify(user);
                fs.writeFile(BlackListPath, str, function (err) {
                    if (err) return console.error(err);
                    console.log(`${interaction.user.tag}刪除所有用戶id`);
                    interaction.reply(`${interaction.user}已成功刪除所有用戶id`);
                })
            })
        }
	},
};