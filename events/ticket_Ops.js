const { MessageEmbed } = require('discord.js');

module.exports ={
    name:"interactionCreate",
    async execute(client,interaction){
        if (!interaction.isButton()) return;
        const { guild, customId, channel} = interaction;
        if (!["Close_ticket_Button"]) return;

        const embed = new MessageEmbed()
        embed.setColor(color=0xE693CB)

        switch(customId) {
            case "Close_ticket_Button":
                channel.delete().then((ch) =>{
                    interaction.reply({content: "客服單已關閉"})
                })
                
        }
    }
}