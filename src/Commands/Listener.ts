import {Client, Message} from "discord.js";
import {changeGameConfigCommand} from "./CommandHandler";

export const listenForCommands = (client: Client)  => {
    client.on('messageCreate', async (msg:Message) => {
        await changeGameConfigCommand(msg)
    })
}