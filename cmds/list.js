module.exports.run = async (bot, message, args, db, prefix) => {

    // role check
    const accessRoles = ['RoleA', 'Vice Master', 'Clan Master'];
    let canAccess = false;
    if (message.member.roles.cache.some(r => accessRoles.includes(r.name))) {
        canAccess = true;
    }
    if (!canAccess) {
        message.reply("you can't use this command!");
        return;
    }

    let guildMembers = message.guild.members.cache.filter(m => !m.user.bot).array();
    let members = [];
    guildMembers.forEach(m => {
        members.push({ username: m.user.username, id: m.id });
    });

    let activeMembers;
    let ids = [];

    db.collection('guild-members').doc(message.guild.id).get().then((q) => {
        if (q.exists) {
            activeMembers = q.data().members;
            activeMembers.forEach(a => ids.push(a.id));
        }
    }).then(() => {
        members = members.filter(m => !ids.includes(m.id));
        let msg = 'The following players haven\'t opted in as an active member:\n\n';
        if (members.length != 0) {
            members.forEach(m => {
                msg += m.username + '\n';
            })
            // msg += '\nPlease don\'t forget to opt in as an active user in this server (by typing ' + prefix + 'active) if you don\'t' +
            //     ' want to be removed during the  upcoming clean-up.';
        } else {
            msg = 'Everyone has opted in as an active member.';
        }
        message.channel.send(msg);

    });
}

module.exports.help = {
    name: 'list'
}