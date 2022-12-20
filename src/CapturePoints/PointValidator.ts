import {GuildMember, Message, AnyThreadChannel} from "discord.js";
import {getEnabledGame} from "../Cache/cachedGames";
import * as path from "path";
import {findLastPlayerMessage, incrementPoints, rate, threadPointsLimitReached} from "./APIOperations";
/*
you get points when:
    the thread the message was in is in a valid channel
    the thread creator is someone with pp roles
    the message is sent by the parent message author
    the message isn't sent by the player
 */

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

    let originalMessageMember: string;
    if(channel.id === "1049916451974287381") {
        //looking for hey kaibear channel
        originalMessageMember =  (await thread.fetchStarterMessage())?.content
            .replace("/[<@>]/g", "") as string;
        if(originalMessageMember.length === 0) return;
    }else{
       {
           let member = (await thread.fetchStarterMessage())?.member;
           if(member === null || member === undefined) return;
           originalMessageMember = member.id;
       }
    }

    if (!(originalMessageMember === message.member?.id)) return; //if it's not the original message creator, GO BACK ☠☠

    const bonusPoints = await rate(await findLastPlayerMessage(thread, player.id));

    if ((await threadPointsLimitReached(thread.id, enabledGame.pointsPerMessage))) return;

    await incrementPoints(enabledGame.pointsPerMessage, player.id, enabledGame, bonusPoints);
}

export const threadCreatePoints = async (thread: AnyThreadChannel) => {
    const enabledGame = await getEnabledGame();
    if(!enabledGame.enabled) return;

    const channel = await thread.parent;
    if(!enabledGame.channelIds.includes(channel?.id as string)) return;

    const player: GuildMember | null | undefined = (await thread.fetchOwner())?.guildMember;
    if (player === null || player === undefined) return;
    if (!(enabledGame.roleIds.split(" ").some(roleId => player.roles.cache.has(roleId)))) return; //role check

    const originalMessageMember = (await thread.fetchStarterMessage())?.member;

    if(originalMessageMember === null || originalMessageMember === undefined) return;
    if(originalMessageMember.id === player.id) return; //no points for themselves 🤣🙄

    const bonusPoints = await rate(await findLastPlayerMessage(thread, player.id));

    await incrementPoints(enabledGame.pointsPerThreadCreation, player.id, enabledGame, bonusPoints);
}
