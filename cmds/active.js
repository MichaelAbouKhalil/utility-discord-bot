module.exports.run = async (bot, message, args, db) => {

    let members;
    let member = {
        username: message.author.username,
        id: message.author.id
    };
    let found = false;

    db.collection('guild-members').doc(message.guild.id).get().then((q) => {
        if (q.exists) {
            members = q.data().members;
        }
    }).then(() => {
        if (members) {
            members.forEach(m => {
                if (m.id === member.id) {
                    found = true;
                }
            });
            if (!found) {
                members.push(member);
            }
        } else {
            members = [member];
        }
        if (!found) {

            db.collection('guild-members').doc(message.guild.id).update({
                'members': members
            }).then(() => {
                message.reply('you\'re an active member of the server and won\'t be removed when the bot does a clean-up.');
            });
        }else{
            message.reply('you are already opted in.');
        }
    });
}

module.exports.help = {
    name: 'active'
}