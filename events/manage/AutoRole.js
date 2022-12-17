const { Find_data_guild_id } = require("../../utils/sqlite");

module.exports = {
    name:"guildMemberAdd",
    async execute(client, member) {
        let res = await Find_data_guild_id(member.guild.id, "joinrole")
        if (!res) return;
        
        const Role = member.guild.roles.cache.find(r => r.id === res.Role_id);
        member.roles.add(Role)
    }   
}
