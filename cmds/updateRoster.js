module.exports.run = async (bot, oldMember, newMember) => {

    // test server roster
    // let channelId = '715481631611289631';
    // TZT server roster
    let channelId = '649663863800856591';
    let displayRoles = ['Clan Master', 'Vice Master', 'Scrim Manager', 'Admin', 'Mod', 'Clan Member'];

    // if(oldMember)

    let members = newMember.guild.members.cache.filter(m => !m.user.bot);
    let serverRoles = newMember.guild.roles.cache.filter(r => displayRoles.includes(r.name));
    let roles = [];
    serverRoles.forEach(r => {
        let roleMember = r.members;
        let members = [];
        roleMember.forEach(m => {
            members.push({
                id: m.user.id,
                name: m.user.username
            });
        });
        let obj = {
            name: r.name,
            members: members
        };
        roles.push(obj);
    });

    let roster = '';
    displayRoles.forEach(role => {
        roles.forEach(r => {
            if(role === r.name){
                let name = '';
                if(r.name === 'Clan Member'){
                    name = r.name + ' (total ' + r.members.length + ')'
                }else{
                    name = r.name;
                }
                roster += '\n\n__**' + name+'**__\n';
                r.members.forEach(m => {
                    roster += '\n<@'+m.id+'>';
                });
            }
        });
    });
    let channel = newMember.guild.channels.cache.get(channelId);
    // channel.bulkDelete(100);
    // channel.send(roster);
}

module.exports.help = {
    name: 'updateRoster'
}