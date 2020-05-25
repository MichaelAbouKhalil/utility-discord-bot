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
        let removedCount = members.length;
        let removedMsg = removedCount + ' member/s were removed from the server.\n\nRemoved member/s are as follows:\n\n';    
        if (members.length != 0) {
            members.forEach(m => {
                msg = 'Hi <@' + m.id + '>, I\'m messaging you  about TeamZtone\'s Discord server which you were apart of.\n\n' +
                    'Time to time we do a server clean-up and in doing so we remove inactive members.\n\n' +
                    'Because you did not opt in as an active member when you joined you\'ve now been removed from the server.\n\n' +
                    'Please note that if you believe this happened by mistake and you wish to rejoin, please use the link below:\n\n' +
                    'https://discord.gg/PRS2dxR \n\n' +
                    'Don\'t forget to opt in as an active member by typing ^active' +
                    'We wish you all the best!';
                removedMsg += m.username + '\n';
                bot.users.fetch(m.id).then(user => {
                    user.send(msg).then(() => {
                        message.guild.members.cache.get(m.id).kick();
                    });
                });
            })
        }
        message.channel.send(removedMsg);
    }).catch(e => {
        message.channel.send('Jack is missing permissions!');
        console.log(e);
    });
}

module.exports.help = {
    name: 'clean'
}