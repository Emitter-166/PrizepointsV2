import {Client, IntentsBitField, Message, Role, TextChannel} from 'discord.js';
import * as path from "path";
import {getEnabledGame} from "./Cache/cachedGames";
import {listen} from "./CapturePoints/Listener";
import {changeGameConfig, changeGameStatus, createGame} from "./Commands/APIOperation";
import {listenForCommands} from "./Commands/Listener";
import {showGames} from "./Commands/Commands";
const {Flags} = IntentsBitField;
export const API_URL = "localhost:3000";
export const COMMAND_PREFIX = "!pp";

require('dotenv').config({
    path: path.join(__dirname, ".env")
});
const client = new Client({
    intents: [Flags.MessageContent, Flags.GuildMessages, Flags.Guilds, Flags.GuildMembers, Flags.Guilds]
})

client.on('messageCreate', async msg => {
    if(msg.content !== "!test") return;
})
listen(client);
listenForCommands(client);
const test = async () => {
    // await showGames();
}
test();


client.login(process.env._TOKEN).then(() => {
    console.log("bot ready")
});



