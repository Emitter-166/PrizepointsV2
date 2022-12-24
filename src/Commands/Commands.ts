import {EmbedBuilder, Message} from "discord.js";
import {changeGameConfig, changeGameStatus, createGame} from "./APIOperation";
import {API_URL} from "../index";
import * as fs from "fs";

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

    if(args[3].length > 5){
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
    if(args[3].length > 5){
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
    showGamesText +=    "------        -------------    -------------     ----------------     ----------           ------------             -------------- \n";
    let response = await fetch(`http://${API_URL}/api/v1/games`, {
        headers: {
            "Authorization": "Basic " + process.env._AUTH_TOKEN
        }
    });
    const games:game[] = await response.json();
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
            if(name !== undefined){
                roles += name + ", ";
            }
        })

        game.channelIds.split(" ").forEach(channel => {
           const name = msg.guild?.channels.cache?.get(channel)?.name;
           if(name !== undefined){
               channels += name + ", ";
           }
        })
        showGamesText += `${id}             ${name}             ${roles}             ${channels}             ${enabled}             ${createPoints}             ${messagePoints} \n`;
    })
    fs.writeFileSync("games.txt", showGamesText);
    await msg.reply({files: ["games.txt"], allowedMentions: {repliedUser: false}});
}

export const sendLeaderboard = async (msg: Message) => {

}