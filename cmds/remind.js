module.exports.run = async (bot, message, args, db) => {

    // role check
    const accessRoles = ['Scrim Manager'];
    let canAccess = false;
    if (message.member.roles.cache.some(r=>accessRoles.includes(r.name))){
        canAccess = true;
    }
    if(!canAccess){
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
        let msg = '';
        if (members.length != 0) {
            members.forEach(m => {
                msg += '<@' + m.id + '> ';
            })
            msg += 'Please don\'t forget to opt in as an active user in this server if you don\'t want to be removed.'
        } else {
            msg = 'Everyone has been verified';
        }
        message.channel.send(msg);
        // bot.users.fetch('331200747318542336').then(user => {
        //     user.send('hi' + user.username);
        // })
    });
}

module.exports.help = {
    name: 'remind'
}