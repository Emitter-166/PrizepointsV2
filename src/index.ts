import {Client, IntentsBitField} from 'discord.js';
import * as path from "path";
import {getEnabledGame} from "./Cache/cachedGames";
import {listen} from "./CapturePoints/Listener";
const {Flags} = IntentsBitField;
export const API_URL = "localhost:3000";
require('dotenv').config({
    path: path.join(__dirname, ".env")
});
const client = new Client({
    intents: [Flags.MessageContent, Flags.GuildMessages, Flags.Guilds, Flags.GuildMembers]
})

client.on('messageCreate', async msg => {
    if(msg.content !== "!test") return;
    if(!(await getEnabledGame()).enabled) return;
    //
    //
})
listen(client);
const test = async () => {
}
test();
client.login(process.env._TOKEN).then( () => console.log("I am ready"));



