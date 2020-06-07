module.exports.run = (bot, message, args, db, prefix) => {

    // id of channel: clan-application-results
    let channelId = '672990677683929148';

    // restrict channel
    let accessChannel = channelId;
    if (message.channel.id != accessChannel) {
        return;
    }

    // role check
    const accessRoles = ['Admin', 'Clan Master', 'Vice Master', 'Mod', 'Application Manager',
        'Recruitment Manager'];
    let canAccess = false;
    if (message.member.roles.cache.some(r => accessRoles.includes(r.name))) {
        canAccess = true;
    }
    if (!canAccess) {
        message.reply("you can't use this command!");
        return;
    }

    // message should be received as 'application accept @..' or 'application reject @...'
    let isAccept = false;
    if (args.length >= 1) {
        if (args[0].toLowerCase() === 'accept') {
            isAccept = true;
        } else if (args[0].toLowerCase() === 'reject') {
            isAccept = false;
        } else {
            message.reply('Please Specify decision!');
            return;
        }
    } else {
        message.reply('Missing arguments!');
        return;
    }

    // get mentions from message
    let mentions = [];
    message.mentions.users.forEach(m => {
        let mention = {
            id: m.id,
            username: m.username
        };
        mentions.push(mention);
    });

    // at least 1 member should be mentioned
    if (mentions.length === 0) {
        message.reply('PLease mention members!');
        return;
    }

    db.collection('messages').doc('Tryout').get()
        .then(q => {
            if (q.exists) {
                let messages = q.data();

                let msg = '';
                mentions.forEach(m => {
                    msg += '<@' + m.id + '> ';
                });
                msg += '\n\n';

                msg += isAccept ? messages.accept : messages.reject;
                msg = msg.replace(/\\n/g, '\n');

                let channel = message.guild.channels.cache.get(channelId);
                channel.send(msg).then(() => {
                    message.delete({timeout: 100});
                });
            }
        });
}

module.exports.help = {
    name: 'tryout'
}