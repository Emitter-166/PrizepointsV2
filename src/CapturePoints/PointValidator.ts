import {GuildMember, Message, AnyThreadChannel} from "discord.js";
import {getEnabledGame} from "../Cache/cachedGames";
import * as path from "path";
/*
you get points when:
    the thread the message was in is in a valid channel
    the thread creator is someone with pp roles
    the message is sent by the parent message author
    the message isn't sent by the player
 */

require('dotenv').config({
    path: path.join(__dirname, ".env")
})
const API_URL = "localhost:3000";
export const messageCreatePoint = async (message: Message) => {
    if (!message.channel.isThread()) return;

    const thread = message.channel as AnyThreadChannel;
    const channel = thread.parent;


    const enabledGame = await getEnabledGame();
    if (!enabledGame.enabled) return; //this means there are no enabled games

    if (channel === null) return;
    if (!enabledGame.channelIds.includes(channel.id)) return; //channel check

    const player: GuildMember | null | undefined = (await thread.fetchOwner())?.guildMember;
    if (player === null || player === undefined) return;
    if (!enabledGame.roleIds.split(" ").some(roleId => player.roles.cache.has(roleId))) return; //role check

    if (message.member?.roles.cache.some(role => enabledGame.roleIds.includes(role.id))) return; //no points for themselves 💀

    const originalMessageMember = (await thread.fetchStarterMessage())?.member;
    if (!(originalMessageMember === message.member)) return; //if it's not the original message creator, GO BACK ☠☠

    const bonusPoint = await rate(await findLastPlayerMessage(thread, player.id));

    if ((await threadPointsLimitReached(thread.id, enabledGame.pointsPerMessage))) return;

    incrementPoints(enabledGame.pointsPerMessage, player.id, bonusPoint);
}


const incrementPoints = (points: number, userId: string, bonus?: number) => {
    console.log({
        points: points,
        userId: userId,
        bonus: bonus
    })


}
export const pointsTableCache = new Map<string, number>();


const getUserPoints = async (userId: string, game: game): Promise<number> => {
    let result = 0;
    const cachedUser = pointsTableCache.get(userId);
    if (cachedUser !== undefined) {
        result = cachedUser;
    } else {
        let response = await fetch(`http://${API_URL}/api/v1/points?name=${game.name}`, {
            headers: {
                "Authorization": "Basic " + process.env._AUTH_TOKEN
            }
        });

        if(response.status === 200){
            const data = await response.json();
            (data.model as pointsTableData).forEach(user => {
                if(user.userId === userId) result = user.points;
                pointsTableCache.set(user.userId, user.points)
            })
        }else{
            await setUserPoints(userId, 0, await getEnabledGame())
            result = 0;
        }
    }
    return Promise.resolve(result);
}

const setUserPoints = async (userId: string, points: number, game:game) => {
    pointsTableCache.set(userId, points)
   await fetch(`http://${API_URL}/api/v1/points?name=${game.name}&userId=${userId}&points=${points}`, {
        headers: {
            "Authorization": "Basic " + process.env._AUTH_TOKEN
        }
    });
}

export const findLastPlayerMessage = async (thread: AnyThreadChannel, userId: string): Promise<string> => {
    let game = await getEnabledGame();
    if (!game.enabled) return Promise.resolve("");

    const messages = await thread.messages.fetch({limit: 100})
    for (const msg of messages) {
        if (msg[1].member !== null) {
            if (msg[1].member.user.id === userId) {
                return Promise.resolve(msg[1].content);
            }
        }
    }
    return Promise.resolve("");
}

export const rate = async (msg: string): Promise<number> => {
    const response = await (await fetch(`http://209.126.86.43:1010/?message=${msg}`)).json();
    return Promise.resolve(response.rating as number);
}

export const threadPointsLimitReached = async (threadId: string, points: number): Promise<boolean> => {
    let response = await fetch(`http://${API_URL}/api/v1/threads?threadId=${threadId}`, {
        headers: {
            "Authorization": "Basic " + process.env._AUTH_TOKEN
        }
    });
    if (response.status === 400) {
        fetch(`http://${API_URL}/api/v1/threads?threadId=${threadId}&points=${points}`, {
            headers: {
                "Authorization": "Basic " + process.env._AUTH_TOKEN
            }
        });
        return false;
    } else {
        const data = await response.json();
        const threadPoints = data.model.points;
        if (threadPoints + points >= 200) {
            return true;
        } else {
            fetch(`http://${API_URL}/api/v1/threads?threadId=${threadId}&points=${threadPoints + points}`, {
                headers: {
                    "Authorization": "Basic " + process.env._AUTH_TOKEN
                }
            });
            return false;
        }
    }
}