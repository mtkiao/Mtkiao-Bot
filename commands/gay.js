const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gay')
		.setDescription('可以獲取gay值(?  注:本功能*沒有*要歧視gay的意思')
        .addUserOption(option =>option.setName('成員').setDescription('指定一位成員')),
	async execute(interaction,client) {
        await interaction.deferReply();
        let member = interaction.options.getUser('成員');
        if (!member){
            member = interaction;
        }
        else{
            member = interaction.guild.members.cache.get(member.id);
        }
        const gay = Math.round(Math.random()*100);
        const embed2 = new MessageEmbed()
        embed2.setColor(color=0xE693CB)
        embed2.setTitle(`${member.user.tag} - gay`)
        embed2.setTimestamp()
        embed2.setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

        if (gay <= 10){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥 / **${gay}%**`)
        }
        else if (gay >= 10 && gay <= 20){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧 / **${gay}%**`)
        }
        else if (gay >= 20 && gay <= 30){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨 / **${gay}%**`)
        }
        else if (gay >= 30 && gay <= 40){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩 / **${gay}%**`)
        }
        else if (gay >= 40 && gay <= 50){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩🟦 / **${gay}%**`)
        }
        else if (gay >= 50 && gay <= 60){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩🟦🟪 / **${gay}%**`)
        }
        else if (gay >= 60 && gay <= 70){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩🟦🟪🟥 / **${gay}%**`)
        }
        else if (gay >= 70 && gay <= 80){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩🟦🟪🟥🟧 / **${gay}%**`)
        }
        else if (gay >= 80 && gay <= 90){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩🟦🟪🟥🟧🟨 / **${gay}%**`)
        }
        else if (gay >= 90 && gay <= 99){
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩 / **${gay}%**`)
        }
        else{
            embed2.setDescription(`${member.user} 的**gay**值\n🟥🟧🟨🟩🟦🟪🟥🟧🟨🟩🟦🟪 / **${gay}%**\ngay王!🛐`)
        }
        await interaction.editReply({ embeds: [embed2] });
	},
};