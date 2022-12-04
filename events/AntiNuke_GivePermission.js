const { Permissions } = require('discord.js');
const { Find_data_guild_id } = require("../Command_Library/sqlite");

module.exports = {
    name:"roleUpdate",
    async execute(client, oldRole, newRole) {
        var res = await Find_data_guild_id(newRole.guild.id,"antinuke");
        if (!res || !res.role_protect) return;
        var give_permission;
        newRole.guild.fetchAuditLogs()
        .then(logs => {
            give_permission = logs.entries
                .filter(e => e.action === 'ROLE_UPDATE' && e.executor.id != 994114876815446027)
                .sort((a, b) => b.createdAt - a.createdAt)
                .first()
            // let whitelist = JSON.parse(res.whitelist);
            let UserId = give_permission.executor.id;
            // try{ if (whitelist[newRole.guild.id][UserId].indexOf('Give_Role_Admin_Permission') != -1) return } catch{}

            if (!oldRole.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && newRole.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) { var permissions_name = "管理員權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.KICK_MEMBERS) && newRole.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) { var permissions_name = "踢人權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.BAN_MEMBERS) && newRole.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) { var permissions_name = "封鎖權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS) && newRole.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) { var permissions_name = "管理頻道權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG) && newRole.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) { var permissions_name = "檢視審核日誌權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) && newRole.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) { var permissions_name = "管理訊息權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES) && newRole.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) { var permissions_name = "管理暱稱權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.MANAGE_ROLES) && newRole.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) { var permissions_name = "管理身分組權限" }
            else if (!oldRole.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS) && newRole.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) { var permissions_name = "管理WebHook權限" }
            if (!permissions_name) return;
            try{
                console.log(`違規用戶: ${give_permission.executor.tag} ${newRole.guild.id}`);
                let member = newRole.guild.members.cache.get(give_permission.executor.id);
                member.kick(reason=`防炸群防護生效 違規內容:給予危險權限(${permissions_name})`);
                let role = newRole.guild.roles.cache.get(give_permission.target.id);
                role.setPermissions([oldRole.permissions])
            } catch{}
        })
    }
}