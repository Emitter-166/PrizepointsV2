import {ColorResolvable, EmbedBuilder, Message, PermissionsBitField} from "discord.js";
import {changeGameConfig, changeGameStatus, createGame} from "./APIOperation";
import {API_URL, client} from "../index";
import * as fs from "fs";
import {pointsTableCache} from "../CapturePoints/APIOperations";
import {getEnabledGame} from "../Cache/cachedGames";


export const create = async (msg: Message) => {
    const args = msg.content.split(" ");
    if (args.length !== 3) {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "not a valid name!```");
        await msg.reply({embeds: [error]});
        return;
    }
    const createGameName = args[2];

    const created = await createGame(createGameName)
    if (created) {
        const gameCreateSuccess = new EmbedBuilder()
            .setDescription("```" +
                "game created! Don't forget to enable it```");
        await msg.reply({embeds: [gameCreateSuccess]});
    } else {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Game already exist!```");
        await msg.reply({embeds: [error]});
    }
}

export const enable = async (msg: Message) => {
    const args = msg.content.split(" ");
    if (args.length !== 3) {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "not a valid name!```");
        await msg.reply({embeds: [error]});
        return;
    }
    const gameName = args[2];
    const isUpdated = await changeGameStatus(gameName, true);
    if (isUpdated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game enabled!```");
        await msg.reply({embeds: [success]});
    } else {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "Game not found! So a game was created. \n" +
                "Please enable it again```");
        await msg.reply({embeds: [success]});
    }
}

export const disable = async (msg: Message) => {
    const args = msg.content.split(" ");
    if (args.length !== 3) {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "not a valid name!```");
        await msg.reply({embeds: [error]});
        return;
    }
    const gameName = args[2];
    const isUpdated = await changeGameStatus(gameName, false);
    if (isUpdated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game disabled!```");
        await msg.reply({embeds: [success]});
    } else {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "Game not found! So a game was created.```");
        await msg.reply({embeds: [success]});
    }
}

export const addRoles = async (msg: Message) => {
    const args = msg.content.split(" ");

    if (args.length < 2) return;

    let roleIds: string[] = [];
    const gameName = args[2];
    args.forEach((str, i) => {
        if (i > 2) {
            roleIds.push(str);
        }
    })
    const updated = await changeGameConfig(gameName, "roles", "add", roleIds);
    if (updated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game roles updated!```");
        await msg.reply({embeds: [success]});
    } else {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Game not found!```");
        await msg.reply({embeds: [error]});
    }
}

export const removeRoles = async (msg: Message) => {
    const args = msg.content.split(" ");

    if (args.length < 2) return;

    let roleIds: string[] = [];
    const gameName = args[2];
    args.forEach((str, i) => {
        if (i > 2) {
            roleIds.push(str);
        }
    })
    const updated = await changeGameConfig(gameName, "roles", "remove", roleIds);
    if (updated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game roles updated!```");
        await msg.reply({embeds: [success]});
    } else {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Game not found!```");
        await msg.reply({embeds: [error]});
    }
}

export const addChannels = async (msg: Message) => {
    const args = msg.content.split(" ");

    if (args.length < 2) return;

    let channelIds: string[] = [];
    const gameName = args[2];
    args.forEach((str, i) => {
        if (i > 2) {
            channelIds.push(str);
        }
    })
    const updated = await changeGameConfig(gameName, "channels", "add", channelIds);
    if (updated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game channels updated!```");
        await msg.reply({embeds: [success]});
    } else {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Game not found!```");
        await msg.reply({embeds: [error]});
    }
}

export const removeChannels = async (msg: Message) => {
    const args = msg.content.split(" ");

    if (args.length < 2) return;

    let channelIds: string[] = [];
    const gameName = args[2];
    args.forEach((str, i) => {
        if (i > 2) {
            channelIds.push(str);
        }
    })
    const updated = await changeGameConfig(gameName, "channels", "remove", channelIds);
    if (updated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game channels updated!```");
        await msg.reply({embeds: [success]});
    } else {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Game not found!```");
        await msg.reply({embeds: [error]});
    }
}

export const createPoints = async (msg: Message) => {
    const args = msg.content.split(" ");
    if (args.length < 2) return;
    const gameName = args[2];

    if (args[3].length > 5) {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Invalid points```");
        await msg.reply({embeds: [error]});
        return;
    }

    const data: string[] = [args[3], "0"];
    const updated = await changeGameConfig(gameName, "rewards", "add", data);
    if (updated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game message rewards updated!```");
        await msg.reply({embeds: [success]});
    } else {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Game not found!```");
        await msg.reply({embeds: [error]});
    }
}

export const messagePoints = async (msg: Message) => {
    const args = msg.content.split(" ");
    if (args.length < 2) return;

    const gameName = args[2];
    if (args[3].length > 5) {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Invalid points```");
        await msg.reply({embeds: [error]});
        return;
    }
    const data: string[] = ["0", args[3]];
    const updated = await changeGameConfig(gameName, "rewards", "remove", data);
    if (updated) {
        const success = new EmbedBuilder()
            .setDescription("```" +
                "game thread rewards updated!```");
        await msg.reply({embeds: [success]});
    } else {
        const error = new EmbedBuilder()
            .setDescription("```" +
                "Game not found!```");
        await msg.reply({embeds: [error]});
    }
}

export const showGames = async (msg: Message) => {
    let showGamesText = "Id             name             roles             channels             enabled?             createPoints             messagePoints \n";
    showGamesText += "------        -------------    -------------     ----------------     ----------           ------------             -------------- \n";
    let response = await fetch(`http://${API_URL}/api/v1/games`, {
        headers: {
            "Authorization": "Basic " + process.env._AUTH_TOKEN
        }
    });
    const games: game[] = await response.json() as any;
    games.forEach(game => {
        const name = game.name;
        const id = game.id;
        let roles = "";
        let channels = "";
        const enabled = game.enabled;
        const createPoints = game.pointsPerThreadCreation;
        const messagePoints = game.pointsPerMessage;

        game.roleIds.split(" ").forEach(role => {
            const name = msg.guild?.roles.cache?.get(role)?.name;
            if (name !== undefined) {
                roles += name + ", ";
            }
        })

        game.channelIds.split(" ").forEach(channel => {
            const name = msg.guild?.channels.cache?.get(channel)?.name;
            if (name !== undefined) {
                channels += name + ", ";
            }
        })
        showGamesText += `${id}             ${name}             ${roles}             ${channels}             ${enabled}             ${createPoints}             ${messagePoints} \n`;
    })
    fs.writeFileSync("games.txt", showGamesText);
    await msg.reply({files: ["games.txt"], allowedMentions: {repliedUser: false}});
}


export const sendLeaderboard = async (msg: Message) => {
    const args = msg.content.split(" ");
    let name = args[1];

    let higherStaff = false
    const commandExecutor = msg.member;
    if((commandExecutor?.roles.cache.has("989322114735693858") ||
        commandExecutor?.permissions.has(PermissionsBitField.resolve('Administrator')))) higherStaff = true;

    let enabledGame = await getEnabledGame();
    if (name === undefined || name=== '') name = enabledGame.name;


    const leaderboard = await createLeaderboard(name);
    let time = (new Date()).getTime().toString();
    time = time.substring(0, time.length - 3);



    const embed = new EmbedBuilder()
        .setTitle(name)
        .setColor(leaderboard.colour as ColorResolvable)
        .setThumbnail("https://cdn.discordapp.com/attachments/984688947756138507/1056183205071421490/b940028e380640c7d03b26aecce9953a.jpg")
        .setDescription(leaderboard.text);


    if(higherStaff){
        if(name === enabledGame.name){
            embed.addFields({name: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", value: "ㅤ"}, {
                name: "Live score <a:ut_live:1056282055580864552>",
                value: `updated <t:${time}:R>`
            });

            if (message) {
                const embed = message.embeds[0];
                const newEmbed = new EmbedBuilder()
                    .setColor(embed.color)
                    .setTitle(embed.title)
                    .setThumbnail(embed.thumbnail?.url as string)
                    .setDescription(embed.description);
                await message.edit({embeds: [newEmbed]});
            }
            message = await msg.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
        }else{
            msg.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
        }
    }else{
        if(!message){
            embed.addFields({name: "Live score 🔴 (disabled)", value: "Check <#1056504674150269018> or ask <@765190140887957534> for a **live leaderboard**"});
            msg.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
        }else{
            embed.addFields({name: "Live score 🔴 (disabled)", value: `Check https://discord.com/channels/859736561830592522/${message.channel.id}/${message.id}`});
            msg.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
        }
    }
}

export let message: Message;

export const updateLeaderboard = async (name: string, userId: string, added: number) => {
    if (!message) return;
    const leaderboard = await createLeaderboard(name, {userId: userId, added: added});

    let time = (new Date()).getTime().toString();
    time = time.substring(0, time.length - 3);

    const embed = new EmbedBuilder()
        .setTitle(name)
        .setColor(leaderboard.colour as ColorResolvable)
        .setThumbnail("https://cdn.discordapp.com/attachments/984688947756138507/1056183205071421490/b940028e380640c7d03b26aecce9953a.jpg")
        .setDescription(leaderboard.text)
        .addFields({name: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", value: "ㅤ"}, {
            name: "Live score <a:ut_live:1056282055580864552>",
            value: `updated <t:${time}:R>`
        });
    try{
        await message.edit({embeds: [embed]});
    }catch (err){
        console.log(err);
        return
    }
}

export const createLeaderboard = async (name: string, custom?: {userId: string, added: number}): Promise<{ text: string, colour: string }> => {

    let arr: [string, number][] = [];
    if ((await getEnabledGame()).name === name && pointsTableCache.size > 0) {
        arr = Array.from(pointsTableCache);
    } else {
        const response = (await fetch(`http://${API_URL}/api/v1/points?name=${name}`, {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + process.env._AUTH_TOKEN
            }
        }));
        const data:any = await response.json();
        if (response.status === 400) {
            return Promise.resolve({text: "Game not found", colour: generateRandomLightHexColor()});
        }
        const pointsArr: { userId: string, points: number }[] = data.model;
        pointsArr.forEach(({userId, points}) => {
            arr.push([userId, points]);
        })
    }

    arr.sort((a, b) => b[1] - a[1]);

    if (!client.isReady()) return Promise.resolve({text: "Client not ready", colour: generateRandomLightHexColor()});
    let leaderBoardText;

    if(custom){
        leaderBoardText = alignTextAndPointsWithIndex(arr, {where: custom.userId, points: custom.added});
    }else{
        leaderBoardText = alignTextAndPointsWithIndex(arr );
    }



    leaderBoardText = leaderBoardText.replace("1.", ":first_place:")
        .replace("2.", ":second_place:")
        .replace("3.", ":third_place:")
    return Promise.resolve({text: leaderBoardText, colour: generateRandomLightHexColor()});

}

const generateRandomLightHexColor = (): string => {
    // Generate a random number between 0 and 255
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    // Convert the numbers to hexadecimal
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    // Return the hex color string
    return `#${hexR}${hexG}${hexB}`;
}

const alignTextAndPointsWithIndex = (items: Array<[string, number]>, custom?: { where: string, points: number }): string => {
    let alignedItems = "";

    for (let i = 0; i < items.length; i++) {
        if (items[i][0] === custom?.where) {
            const user = "<@" + items[i][0] + ">";
            const points = "**" + items[i][1] + "**";
            alignedItems += (`${i + 1}.${user} - ${points} <a:arrow_up:1056296707060662322> +*${custom.points}* \n`);
        } else {
            const user = "<@" + items[i][0] + ">";
            const points = "`" + items[i][1] + "`";
            alignedItems += (`${i + 1}.${user} - ${points} \n`);
        }

    }
    return alignedItems;
}