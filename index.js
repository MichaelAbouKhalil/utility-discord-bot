const Discord = require('discord.js');
const fs = require('fs');
require('dotenv/config');

// import settings
const owner = process.env.OWNER;
const token = process.env.TOKEN;
let prefix;

// initialize bot
const bot = new Discord.Client({ disableEveryone: false });
bot.commands = new Discord.Collection();

// initialise database (firebase)
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

bot.on('ready', () => {
    bot.user.setActivity('^help', { type: 'PLAYING' });
    console.log(bot.user.username + ' is online!');
});

fs.readdir('./cmds', (err, files) => {
    if (err) {
        console.log(err);
    }

    let cmdFiles = files.filter(f => f.split(".").pop() === "js");

    if (cmdFiles.length === 0) {
        console.log("No files found");
        return;
    }

    cmdFiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded`);
        bot.commands.set(props.help.name, props);
    })
})

bot.on('message', message => {
    // if another bot ignore
    if (message.author.bot) return;
    // if dm ignore
    if (message.channel.type === 'dm') return;
    // restrict channel: --test -- general -- cleanup
    let accessChannels = ['710381919770247168', '709725120381452289', '715154804791312446',
        '672990677683929148'];
    if (!accessChannels.includes(message.channel.id)) return;

    let ios = false;
    db.collection('guilds').doc(message.guild.id).get().then((q) => {
        if (q.exists) {
            prefix = q.data().prefix;
        }
    }).then(() => {
        let msg_array = message.content.split(" ");
        let command = msg_array[0];
        let args = msg_array.slice(1);

        if (!command.startsWith(prefix)) return;

        if (bot.commands.get(command.slice(prefix.length))) {
            let cmd = bot.commands.get(command.slice(prefix.length));
            if (cmd) {
                cmd.run(bot, message, args, db, prefix);
            }
        }
    })
});

bot.on('guildCreate', async gData => {
    db.collection('guilds').doc(gData.id).set({
        'guildID': gData.id,
        'guidName': gData.name,
        'guildOwner': gData.owner.user.username,
        'guildOwnerID': gData.ownerID,
        'guildMemberCount': gData.memberCount,
        'prefix': '!'
    });

    db.collection('guild-members').doc(gData.id).set({
        'guildID': gData.id,
        'guidName': gData.name,
        'members': [
            {
                username: gData.owner.user.username,
                id: gData.ownerID,
            }
        ]
    });
});

bot.on("guildMemberUpdate", (oldMember, newMember) => {
    let cmd = bot.commands.get('updateRoster');
    cmd.run(bot, oldMember, newMember);
});


bot.login(token);