
module.exports ={
    name:"interactionCreate",
    async execute(client, interaction){
        if (!interaction.isButton()) return;
        const { customId, channel } = interaction;
        if (!["Close_ticket_Button"]) return;

        switch(customId) {
            case "Close_ticket_Button":
                channel.delete().then((ch) =>{
                    interaction.reply({content: "客服單已關閉"})
                }) 
        }
    }
}