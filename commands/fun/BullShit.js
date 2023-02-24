const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bullshit')
		.setDescription('可以生成一段廢話')
    .addStringOption(option =>option.setName('主題名稱').setDescription('請寫出主題名稱').setRequired(true))
    .addIntegerOption(option =>option.setName('字數').setDescription('請寫字數(不能超過1000)').setRequired(true)),
	async execute(interaction, client) {
    const bullshitText = interaction.options.getString('主題名稱');
    const bullshitNumber = Number(interaction.options.getInteger('字數'));
    await interaction.deferReply();
    
    if (bullshitNumber == NaN) return interaction.editReply({ content: `:x:請輸入數字`, ephemeral: true });
    if (bullshitNumber <= 0 || bullshitNumber > 1000) return interaction.editReply({ content: `:x:請輸入大於0的數字且小於1000的數字`, ephemeral: true });

    console.log(bullshitNumber, bullshitText);
    axios.post('https://api.howtobullshit.me/bullshit', {
      MinLen: bullshitNumber,
      Topic: bullshitText
    }).then(res => {
      let req_text = String(res.data.substr(48).replace("<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp",""));
      const embed = new MessageEmbed()
          .setColor(color=0xE693CB)
          .setTitle(`唬爛產稱器 - ${bullshitText}`)
          .setDescription(req_text.replace("<br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",""))
          .setTimestamp()
          .setFooter({ text: `命令使用者:${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
      interaction.editReply({ embeds: [embed] });
    }).catch(error => {
      interaction.editReply({content:`發生錯誤 原因:${error}`, ephemeral:true})
    })
	},
};

