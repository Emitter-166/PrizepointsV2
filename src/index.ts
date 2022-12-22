import {Client, IntentsBitField} from 'discord.js';
import * as path from "path";
import {getEnabledGame} from "./Cache/cachedGames";
import {listen} from "./CapturePoints/Listener";
import {changeGameConfig, changeGameStatus, createGame} from "./Commands/APIOperation";
const {Flags} = IntentsBitField;
export const API_URL = "localhost:3000";
export const COMMAND_PREFIX = "!pp";

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

    for(let i = 0; i < 5; i++) {
        let name = generateRandomWord();
        console.log(await createGame(name))
        console.log(await changeGameStatus(name, true))
        console.log(await changeGameStatus(name, false))
        console.log(await changeGameConfig(name, "rewards", "add", ["100000", "0"]))
        console.log(await changeGameConfig(name, "rewards", "add", ["0", "99999"]))
        console.log(await changeGameConfig(name, "roles", "add", ["sussyRole", "bakaRole", "rmRole"]))
        console.log(await changeGameConfig(name, "roles", "remove", ["rmRole"]))
        console.log(await changeGameConfig(name, "channels", "add", ["sussyChannel", "bakaChannel", "rmChannel"]))
        console.log(await changeGameConfig(name, "channels", "remove", ["rmChannel"]))
    }

}
test();

function generateRandomWord() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let word = '';
    for (let i = 0; i < 5; i++) {
        word += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return word;
}

client.login(process.env._TOKEN).then( () => console.log("I am ready"));



