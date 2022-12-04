const { MessageEmbed } = require('discord.js');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Data/Data.db');

module.exports = {
    name:"messageCreate",
    async execute(client,message) {
        if (message.author.bot) return;
        let res = null
        await new Promise((resolve, reject) => {
            db.each("SELECT * FROM Level", function(err, row) {
                if(err) reject(err);
                if (row.guild_id == message.guildId){
                    res = row;
                    resolve(null);
                }
                else{
                    resolve(null);
                }
            });
        });
        if (!res) return;
        res = null
        await new Promise((resolve, reject) => {
            db.each("SELECT * FROM Level_2", function(err, row) {
                if(err) reject(err);
                if (row.user_id == `${message.author.id}_${message.guildId}`){
                    res = row;
                    resolve(null);
                }
                else{
                    resolve(null);
                }
            });
        });
        if (!res){
            var insertQuery = db.prepare("INSERT INTO Level_2 VALUES (?,?,?,?)");
            insertQuery.run(`${message.author.id}_${message.guildId}`, 1, 1 ,50);
            insertQuery.finalize();
        }
        else{
            const level_random = Math.round(Math.random()*15);
            var updateQuery="update Level_2 set level = ? where user_id = ?" ;
            db.run(updateQuery,[res.level + level_random, `${message.author.id}_${message.guildId}`]);   
            if (res.level + level_random >= res.level_next) {
                var updateQuery="update Level_2 set level_large = ?, level_next = ? where user_id = ?" ;
                db.run(updateQuery,[res.level_large + 1, res.level_next*2 , `${message.author.id}_${message.guildId}`]); 

                const embed = new MessageEmbed()
                .setColor(color=0xE693CB)
                .setTitle(`${message.author.tag}已經到**${res.level_large + 1}**等級了!`)
                .setDescription(`${message.author}的等級已經來到了${res.level_large + 1}，距離下次升級還要${res.level_next*2 - (res.level + level_random)}個經驗值!`)
                .setTimestamp()
                message.channel.send({ embeds: [embed] })
                    .then((m) => {
                        setTimeout(() =>{
                            m.delete().catch(() => {});
        
                        }, 1 * 5000)
                    })
            }
        }
    }   
}
