import {AnyThreadChannel, Client, IntentsBitField} from 'discord.js';
import * as path from "path";
import {getEnabledGame} from "./Cache/cachedGames";
import {listen} from "./CapturePoints/Listener";
const {Flags} = IntentsBitField;

require('dotenv').config({
    path: path.join(__dirname, ".env")
});
const client = new Client({
    intents: [Flags.MessageContent, Flags.GuildMessages, Flags.Guilds, Flags.GuildMembers]
})

client.on('messageCreate', async msg => {
    if(msg.content !== "!test") return;
    if(!msg.channel.isThread()) return;

    await msg.delete();
    console.log(msg.channel.isThread)
})
listen(client);
client.login(process.env._TOKEN);



