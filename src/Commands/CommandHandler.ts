import {Message, PermissionsBitField} from "discord.js";
import {COMMAND_PREFIX} from "../index";

export const changeGameConfigCommand = async (msg: Message) => {
    if(!msg.content.startsWith(COMMAND_PREFIX)) return;

    const commandExecutor = msg.member;

    if(!(commandExecutor?.roles.cache.has("989322114735693858") ||
        commandExecutor?.permissions.has(PermissionsBitField.resolve('Administrator')))) return;

    const args = msg.content.split(" ");
    if(args.length < 3) return;

    const commandName = args[1];
    switch (commandName){
        case "create":
        case "addRole":
        case "removeRole":
        case "addChannel":
        case "removeChannel":
        case "createPoints":
        case "messagePoints":
    }

}