import {AnyThreadChannel, Client, Message} from "discord.js";
import {messageCreatePoint, threadCreatePoints} from "./PointValidator";

export const listen = (client:Client) => {
    try{
        client.on('messageCreate', async (message:Message) => {
            await messageCreatePoint(message);
        })

        client.on('threadCreate', async (thread: AnyThreadChannel) => {
            await threadCreatePoints(thread)
        })

        client.on('guildMemberAvailable', async () => {

        })
    }catch (err){
        console.log(err)
        return
    }
}