const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('可以獲取機器人的使用說明~')
		.addStringOption(option =>option.setName('命令分類')
		.setDescription('可以選擇分類來查看使用說明')
			.addChoices(
				{ name: '👑管理員(Admin)', value: 'Admin' },
				{ name: '🛡️防炸群(Antinuke)', value: 'Antinuke' },
				{ name: '🔧工具(Tools)', value: 'Tools' },
				{ name: '🎟️客服單(ticket)', value: 'ticket' },
				{ name: '🤣娛樂(fun)', value: 'fun' },
		)),
	async execute(interaction,client) {
		const Help_son = interaction.options.getString('命令分類');
		if (Help_son == 'Admin'){
			const embed = new MessageEmbed()
				.setColor(color=0xE693CB)
				.setTitle('幫助菜單 - 👑管理員(Admin)')
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription('我的命令字首:`/`\n目前正在開發中，以後會新增更多功能!')
				.addFields(
					{ name: '命令:', value: [
						`**/ban (*成員) (原因)** - 可以封鎖指定成員`,
						`**/kick (*成員) (原因)** - 可以踢出指定成員`,
						`**/timeout (*成員) (原因)** - 可以禁言指定的成員`,
						`**/purge (*訊息數量)** - 可以刪除指定數量的訊息`,
						`**/give_everyone_role (*身分組)** - 可以給全部的成員添加指定的身分組`,
						`**/setupLevel** - 可以開啟或關閉等級系統`,
						`**/blacklist add (*成員ID)** - 可以對指定用戶添加黑名單(入群封鎖)`,
						`**/blacklist view** - 可以查看黑名單(入群封鎖)有哪些ID`,
						`**/blacklist remove (*成員ID)** - 可以對指定用戶解除黑名單(入群封鎖)`,
						`**/blacklist remove_all** - 可以刪除所有黑名單(入群封鎖)裡的用戶\n`,
						].join("\n")
					}
				)
				.setFooter({ text: `Made by mtkiao129#2443`, iconURL: client.user.displayAvatarURL() })
				.setTimestamp()
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'Antinuke'){
			const embed = new MessageEmbed()
				.setColor(color=0xE693CB)
				.setTitle('幫助菜單 - 🛡️防炸群(Antinuke)')
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription('我的命令字首:`/`\n目前正在開發中，以後會新增更多功能!')
				.addFields(
					{ name: '命令:', value: [
						`**/antinuke** - 可以讓群開啟保護、關閉或設定保護(beta版 目前有頻道和身分組權限防護 目前不支持設定白明單!!)`,
						`**/antispam** - 可以讓群開啟、關閉或設定防刷頻(暫時不能使用)`,
						`**/scan** - 可以對此群進行安全掃描\n`,
						].join("\n")
					},
				)
				.setFooter({ text: `Made by mtkiao129#2443`, iconURL: client.user.displayAvatarURL() })
				.setTimestamp()
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'Tools'){
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單 - 🔧工具(Tools)')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription('我的命令字首:`/`\n目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令:', value: [
					`**/avatar (*成員)** - 可以獲取指定成員的頭像`,
					`**/help (*命令分類)** - 可以獲取機器人的使用說明`,
					`**/info (成員)** - 可以獲取指定成員的訊息`,
					`**/ping** - 可以獲取當前機器人的延遲狀況`,
					`**/serverinfo** - 可以獲取伺服器的資訊`,
					`**/botinfo** - 可以查看機器人的目前狀態`,
					`**/text** - 可以加密和解密文字`,
					`**/rank (*成員)** - 可以查詢成員的等級資訊(需開啟等級系統)\n`,
				].join("\n")
			},
			)
			.setFooter({ text: `Made by mtkiao129#2443`, iconURL: client.user.displayAvatarURL() })
			.setTimestamp()
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'ticket'){
			const embed = new MessageEmbed()
				.setColor(color=0xE693CB)
				.setTitle('幫助菜單 - 🎟️客服單(ticket)')
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription('我的命令字首:`/`\n目前正在開發中，以後會新增更多功能!')
				.addFields(
					{ name: '命令:', value: [
						`**/ticket (客服單說明) (頻道)** - 可以啟動客服單系統\n`,
					].join("\n")
				},
				)
				.setFooter({ text: `Made by mtkiao129#2443`, iconURL: client.user.displayAvatarURL() })
				.setTimestamp()
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'fun'){
			const embed = new MessageEmbed()
				.setColor(color=0xE693CB)
				.setTitle('幫助菜單 - 🤣娛樂(fun)')
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription('我的命令字首:`/`\n目前正在開發中，以後會新增更多功能!')
				.addFields(
					{ name: '命令:', value: [
						`**/bullshit (主題名稱) (字數)** - 可以生成一段廢話`,
						].join("\n")
					},
				)
				.setTimestamp()
				.setFooter({ text: `Made by mtkiao129#2443`, iconURL: client.user.displayAvatarURL() })
			await interaction.reply({ embeds: [embed]});
		}

		else{
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription('我的命令字首:`/`\n目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令分類:', value: [
					`👑管理員(Admin)`,
					`🛡️防炸群(Antinuke)`,
					`🔧工具(Tools)`,
					`🎟️客服單(ticket)`,
					`🤣娛樂(fun)`,
					`\n**請輸入/help (命令分類)來獲取訊息!**`,
					].join("\n")
				},
			)
			.setFooter({ text: `Made by mtkiao129#2443`, iconURL: client.user.displayAvatarURL() })
			.setTimestamp()
			await interaction.reply({ embeds: [embed]});
		}        
	},
};