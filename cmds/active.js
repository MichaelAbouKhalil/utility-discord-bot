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
        if(members){
            members.forEach(m => {
                if(m.id === member.id) {
                    found = true;
                }
            });
            if(!found){
                members.push(member);
            }
        }else{
            members = [member];
        }
        db.collection('guild-members').doc(message.guild.id).update({
            'members': members
        }).then(() => {
            message.channel.reply('You\'re now an active member of the server!');
        });
    });
}

module.exports.help = {
    name: 'active'
}