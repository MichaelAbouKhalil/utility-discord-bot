module.exports.run = async (bot, message, args, db) => {

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
    let removedMsg = '';
    let msgArr = [];
    db.collection('guild-members').doc(message.guild.id).get().then((q) => {
        if (q.exists) {
            activeMembers = q.data().members;
            activeMembers.forEach(a => ids.push(a.id));
        }
    }).then(() => {
        members = members.filter(m => !ids.includes(m.id));
        let msg = '';
        let removedCount = members.length;
        removedMsg = removedCount + ' member/s were removed from the server.';
        if (members.length != 0) {
            removedMsg += '\n\nRemoved member/s are as follows:\n\n';
            members.forEach(m => {
                bot.users.fetch(m.id).then(user => {
                    msg = 'Hi <@' + m.id + '>, I\'m messaging you about TeamZtone\'s Discord server which you were apart of.\n\n' +
                        'Time to time we do a server clean-up and in doing so we remove inactive members.\n\n' +
                        'Because you did not opt in as an active member when you joined you\'ve now been removed from the server.\n\n' +
                        'If you believe this happened by mistake and wish to rejoin, please use the following link:\n\n' +
                        'https://discord.gg/PRS2dxR \n\n' +
                        'Don\'t forget to opt in as an active member by typing ^active in the attendance channel.\n\n' +
                        'We wish you all the best!';
                    removedMsg += m.username + '\n';
                    if (removedMsg.length >= 1500) {
                        msgArr.push(removedMsg);
                        removedMsg = '';
                    }
                    user.send(msg).then(() => {
                        message.guild.members.cache.get(m.id).kick();
                    });
                });
            })
        }
    })
        .then(() => {
            if (msgArr.length > 0) {
                msgArr.forEach(mm => {
                    message.channel.send(mm);
                });
            }
        })
        .catch(e => {
            message.channel.send('Bot is missing permissions!');
            console.log(e);
        });
}

module.exports.help = {
    name: 'clean'
}