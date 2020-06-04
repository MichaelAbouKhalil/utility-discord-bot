module.exports.run = (bot, message, args, db) => {

    let i = 0
    message.channel.messages.fetch('718004512610320425')
        .then(msg => {
            let interval = setInterval(() => {
                msg.edit('edited ' + i);
                i++;
            }, 10 * 1000);
        });
}

module.exports.help = {
    name: 't'
}