const fs = require('fs');

module.exports = {
    name:"guildMemberAdd",
    async execute(client, member) {
        fs.readFile('./Data/blacklist.json', function (err, Guild) {
            if (err) return console.error(err);
            let user = Guild.toString();
            user = JSON.parse(user);

            if (!user[member.guild.id] || user[member.guild.id].length <= 0) return 
            
            for (var i = 0; i < user[member.guild.id].length; i++) {
                if (String(member.id) == user[member.guild.id][i]) {
                    console.log(`Ban: ${member.id} ${member.guild.name}`)
                    member.ban({reason:`在黑名單(入群封鎖)裡`})
                }
            }
        })   
    }
}