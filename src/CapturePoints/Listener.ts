import {Client, Message, ThreadChannel} from "discord.js";
import {messageCreatePoint} from "./PointValidator";

export const listen = (client:Client) => {
    client.on('messageCreate', async (message:Message) => {
        await messageCreatePoint(message);
    })

    client.on('threadCreate', async (thread: ThreadChannel) => {

    })
}