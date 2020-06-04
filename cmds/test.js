module.exports.run = (bot, message, args, db, prefix, moment) => {

    let date = moment.utc(args[0]);
    let now = moment.utc();
    message.channel.send(date.toString());
    message.channel.send(now.toString());
    // let timeDiff = date - now;
    // let duration = moment.duration(date.diff(now));
    // let dDays = duration.days();
    // let dHours = duration.hours();
    // let dMinutes = duration.minutes();
    // let dSeconds = duration.seconds();
    message.channel.send('Countdown: \n')
        .then(sent => {
            let countdown = setInterval(() => {
                if(sent.reactions.cache.keyArray().includes('❌')){
                    return;
                }
                now = moment.utc();
                if(now.isSame(date) || now.isAfter(date)){
                    sent.edit('Counter Finished!');
                    clearInterval(countdown);
                    return;
                }
                let diff = moment.preciseDiff(date, now);
                sent.edit(diff);

                // now = moment.utc();
                // timeDiff = date - now;
                // duration = moment.duration(date.diff(now));
                // dDays = duration.days();
                // dHours = duration.hours();
                // dMinutes = duration.minutes();
                // dSeconds = duration.seconds();

                // if(duration.asSeconds() <0 ){
                //     sent.edit('FINISHED');
                //     return;
                // }

                // let msg = 'Countdown:\n' + dDays + 'D ' + dHours + 'H:' + dMinutes + 'M:' + dSeconds + 'S remaining';
                // sent.edit(msg);
            }, 10 * 1000);
        });
}

module.exports.help = {
    name: 'test'
}