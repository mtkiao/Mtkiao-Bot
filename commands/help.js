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
					{ name: '🤣娛樂(entertainment)', value: 'entertainment' },
				)),
	async execute(interaction,client) {
		const Help_son = interaction.options.getString('命令分類');
		if (Help_son == 'Admin'){
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單 - 👑管理員(Admin)')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: `Made by mtkiao129#3921`, iconURL: client.user.displayAvatarURL() })
			.setDescription('~我的命令字首:`/`\n~目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令:', value: [
				`**/ban (成員)** - 可以封鎖指定成員`,
				`**/kick (成員)** - 可以踢出指定成員`,
				`**/mute (成員)** - 可以禁言指定的成員`,
				`**/purge (訊息數量)** - 可以刪除指定數量的訊息`,
				`**/addroleall (身分組)** - 可以給全部的成員添加指定的身分組`,
				`**/setupLevel** - 可以開啟或關閉等級系統`,
				`**/blacklist add (成員ID)** - 可以對指定用戶添加黑名單(入群封鎖)`,
				`**/blacklist remove (成員ID)** - 可以對指定用戶解除黑名單(入群封鎖)\n`,
				`**說明 - (&)為非必填選項**`,
					].join("\n")
				},
			);
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'Antinuke'){
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單 - 🛡️防炸群(Antinuke)')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: `Made by mtkiao129#3921`, iconURL: client.user.displayAvatarURL() })
			.setDescription('~我的命令字首:`/`\n~目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令:', value: [
					`**/antinuke** - 可以讓群開啟保護、關閉或設定保護(beta版 目前有頻道和身分組權限防護 目前不支持設定白明單!!)`,
					`**/antispam** - 可以讓群開啟、關閉或設定防刷頻(暫時不能使用)`,
					`**/scan** - 可以對此群進行安全掃描\n`,
					`**說明 - (&)為非必填選項**`,
					].join("\n")
				},
			);
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'Tools'){
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單 - 🔧工具(Tools)')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: `Made by mtkiao129#3921`, iconURL: client.user.displayAvatarURL() })
			.setDescription('~我的命令字首:`/`\n~目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令:', value: [
					`**/avatar (&成員)** - 可以獲取指定成員的頭像`,
					`**/help (&命令分類)** - 可以獲取機器人的使用說明`,
					`**/info (成員)** - 可以獲取指定成員的訊息`,
					`**/ping** - 可以獲取當前機器人的延遲狀況`,
					`**/serverinfo** - 可以獲取伺服器的資訊`,
					`**/botinfo** - 可以查看機器人的目前狀態`,
					`**/rank (&成員)** - 可以查詢成員的等級資訊(需開啟等級系統)\n`,
					`**說明 - (&)為非必填選項**`,
					].join("\n")
				},
			);
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'ticket'){
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單 - 🎟️客服單(ticket)')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: `Made by mtkiao129#3921`, iconURL: client.user.displayAvatarURL() })
			.setDescription('~我的命令字首:`/`\n~目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令:', value: [
					`**/ticket (客服單說明) (頻道)** - 可以啟動客服單系統\n`,
					`**說明 - (&)為非必填選項**`,
					].join("\n")
				},
			);
			await interaction.reply({ embeds: [embed]});
		}

		else if (Help_son == 'entertainment'){
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單 - 🤣娛樂(entertainment)')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: `Made by mtkiao129#3921`, iconURL: client.user.displayAvatarURL() })
			.setDescription('~我的命令字首:`/`\n~目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令:', value: [
					`**/bullshit (主題名稱) (字數)** - 可以生成一段廢話`,
					`**/gay (&成員)** - 可以獲取gay值(?  注:本功能*沒有*要歧視gay的意思\n`,
					`**說明 - (&)為非必填選項**`,
					].join("\n")
				},
			);
			await interaction.reply({ embeds: [embed]});
		}

		else{
			const embed = new MessageEmbed()
			.setColor(color=0xE693CB)
			.setTitle('幫助菜單')
			.setTimestamp()
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter({ text: `Made by mtkiao129#3921`, iconURL: client.user.displayAvatarURL() })
			.setDescription('~我的命令字首:`/`\n~目前正在開發中，以後會新增更多功能!')
			.addFields(
				{ name: '命令分類:', value: '👑管理員(Admin)\n🛡️防炸群(Antinuke)\n🔧工具(Tools)\n🎟️客服單(ticket)\n🤣娛樂(entertainment)\n\n**請輸入/help (命令分類)來獲取訊息!**' },
			);
			await interaction.reply({ embeds: [embed]});
		}        
	},
};