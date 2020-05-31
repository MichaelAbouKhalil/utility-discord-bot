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
            members = members.filter(m => !ids.includes(m.id));
            let msgArr = [];
            let msg = "Hi. You've been tagged as you're not down as an active member of the server. " +
            "Please don't forget to opt in as an active member  (by typing ^active) if you don't wish to " +
            "be removed during the upcoming clean-up that <@658815505586716692> will be carrying out. Thanks.\n";
            if (members.length != 0) {
                members.forEach(m => {
                    if (msg.length >= 1500) {
                        msgArr.push(msg)
                        msg = '';
                    }
                    msg += '<@' + m.id + '>\n';

                })
                // msg += '\nHi. You\'ve been tagged as you\'re not down as an active player. Please don\'t forget to opt in as an active user in this server (by typing ' + prefix + 'active) if you don\'t' +
                //     ' want to be removed during thethat <@658815505586716692> will be carrying out. Thanks.';
            } else {
                msg = 'Everyone has opted in as an active member.';
            }
            msgArr.push(msg);
            msgArr.forEach(s => {
                message.channel.send(s);
            });
        }
    });


}

module.exports.help = {
    name: 'remind'
}