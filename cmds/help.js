
module.exports.run = async (bot, message, args, db, prefix) => {

    let fields = [];
    db.collection('commands').doc('default').get().then(q => {

        if (q.exists) {
            let commands = q.data().commands;

            for (const [key, value] of Object.entries(commands)) {
                let obj = {
                    name: prefix + key,
                    value: value
                }
                fields.push(obj);
            }

            message.channel.send({
                embed: {
                    color: 0x00B831,
                    title: 'Bot Commands!',
                    fields: fields
                }
            });


        }
    });
}

module.exports.help = {
    name: 'help'
}