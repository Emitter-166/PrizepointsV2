import {AnyThreadChannel, Client, Message} from "discord.js";
import {messageCreatePoint, threadCreatePoints} from "./PointValidator";

export const listen = (client:Client) => {
    client.on('messageCreate', async (message:Message) => {
        await messageCreatePoint(message);
    })

    client.on('threadCreate', async (thread: AnyThreadChannel) => {
        await threadCreatePoints(thread)
    })
}