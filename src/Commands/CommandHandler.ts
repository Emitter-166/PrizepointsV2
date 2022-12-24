import {EmbedBuilder, Message, PermissionsBitField} from "discord.js";
import {COMMAND_PREFIX} from "../index";

import {
    addChannels,
    addRoles,
    create,
    createPoints, disable, enable,
    messagePoints,
    removeChannels,
    removeRoles, sendLeaderboard,
    showGames
} from "./Commands";

const commands: string[] = ['create', 'enable', 'disable', 'addRoles', 'removeRoles', 'addChannels', 'removeChannels', 'createPoints', 'messagePoints', 'showGames', 'help'];

export const changeGameConfigCommand = async (msg: Message) => {
    if(!msg.content.startsWith(COMMAND_PREFIX)) return;
    const args = msg.content.split(" ");

    if(!commands.some(cmd => cmd === args[1])){
       await sendLeaderboard(msg);
       return;
    }
    const commandExecutor = msg.member;
    if(!(commandExecutor?.roles.cache.has("989322114735693858") ||
        commandExecutor?.permissions.has(PermissionsBitField.resolve('Administrator')))) return;


    if(args[1] === "help"){
        const helpBed = new EmbedBuilder()
            .setColor("White")
            .setTitle(`Every command starts with ${COMMAND_PREFIX}`)
            .setDescription("```" +
                "create         <gameName>              -> create a game \n" +
                "enable         <gameName>              -> enable a game \n" +
                "disable        <gameName>              -> disable game \n" +
                "addRoles       <gameName> <roleIds>    -> add roles \n" +
                "removeRoles    <gameName> <roleIds>    -> remove roles \n" +
                "addChannels    <gameName> <channelIds> -> add channels \n" +
                "removeChannels <gameName> <channelIds> -> remove channels \n" +
                "createPoints   <gameName> <point>      -> thread points \n" +
                "messagePoints  <gameName> <point>      -> message points \n" +
                "showGames                              -> see all games```");

        await msg.reply({embeds: [helpBed], allowedMentions: {repliedUser: false}})
        return;
    }
    if(args.length < 2) return;

    const commandName = args[1];
    switch (commandName){
        case "create":
            await create(msg);
            return;
        case "addRoles":
            await addRoles(msg);
            return;
        case "removeRoles":
            await removeRoles(msg);
            return;
        case "addChannels":
            await addChannels(msg);
            return;
        case "removeChannels":
            await removeChannels(msg);
            return;
        case "createPoints":
            await createPoints(msg);
            return;
        case "messagePoints":
            await messagePoints(msg);
            return;
        case "showGames":
            console.log("cmd found")
            await showGames(msg);
            return;
        case "enable":
            await enable(msg);
            return;
        case "disable":
            await disable(msg);
            return;
    }

}