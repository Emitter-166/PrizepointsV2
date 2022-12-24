import {Client, IntentsBitField, Message, PermissionsBitField, Role, TextChannel} from 'discord.js';
import * as path from "path";
import {getEnabledGame} from "./Cache/cachedGames";
import {listen} from "./CapturePoints/Listener";
import {changeGameConfig, changeGameStatus, createGame} from "./Commands/APIOperation";
import {listenForCommands} from "./Commands/Listener";
import {createLeaderboard, showGames} from "./Commands/Commands";
const {Flags} = IntentsBitField;
export const API_URL = "localhost:3473";
export const COMMAND_PREFIX = "!pp";

require('dotenv').config({
    path: path.join(__dirname, ".env")
});
export const client = new Client({
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

client.once('ready', async () => {
    console.log("ready")
})
client.login(process.env._TOKEN);



