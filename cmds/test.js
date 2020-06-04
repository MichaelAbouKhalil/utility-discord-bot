module.exports.run = (bot, message, args, db, prefix, moment) => {

    let title = args[1]+ ':\n';
    let date = moment.utc(args[0]);
    let now = moment.utc();
    if (now.isSame(date) || now.isAfter(date)) {
        message.channel.send('Counter Finished!');
        return;
    }

    message.channel.send(title + moment.preciseDiff(date, now))
        .then(sent => {
            let countdown = setInterval(() => {
                if (sent.reactions.cache.keyArray().includes('❌')) {
                    return;
                }
                now = moment.utc();
                if (now.isSame(date) || now.isAfter(date)) {
                    sent.edit( title + 'Counter Finished!');
                    clearInterval(countdown);
                    return;
                }
                let diff = title + moment.preciseDiff(date, now);
                sent.edit(diff);
            }, 2 * 1000);
        });
}

module.exports.help = {
    name: 'test'
}