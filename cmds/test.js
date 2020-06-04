module.exports.run = (bot, message, args, db, prefix, moment) => {

    let title = '';
    for(let i =1 ;i < args.length; i++){
        title += args[i] + ' ';
    }
    title += ':\n';
    let date = moment.utc(args[0]);
    let now = moment.utc();
    if (now.isSame(date) || now.isAfter(date)) {
        message.channel.send('Countdown Finished!');
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
                    sent.edit( title + 'Countdown Finished!');
                    clearInterval(countdown);
                    return;
                }
                let diff = title + moment.preciseDiff(date, now);
                sent.edit(diff);
            }, 3 * 1000);
        });
}

module.exports.help = {
    name: 'test'
}