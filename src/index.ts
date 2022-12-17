import {Client, IntentsBitField} from 'discord.js';
import * as path from "path";
const {Flags} = IntentsBitField;

require('dotenv').config({
    path: path.join(__dirname, ".env")
});

const client = new Client({
    intents: [Flags.MessageContent, Flags.GuildMessages, Flags.Guilds]
})



