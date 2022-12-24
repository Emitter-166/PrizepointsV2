import {API_URL} from "../index";
import {getEnabledGame} from "../Cache/cachedGames";

export const createGame = async (name: string): Promise<boolean> => {
    let response = await fetch(`http://${API_URL}/api/v1/games/update?name=${name}`, {
        method: 'POST',
        headers: {
            "Authorization": "Basic " + process.env._AUTH_TOKEN
        }
    });
    return Promise.resolve((await response.json() as any).message === "Game created")
}

export const changeGameStatus = async (name: string, enabled: boolean): Promise<boolean> => {
    const response = await fetch(`http://${API_URL}/api/v1/games/update?name=${name}&enabled=${enabled}`, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + process.env._AUTH_TOKEN
        }
    });
    const data:any = await response.json();

    if (data.message === "Game created")
        return Promise.resolve(false)
    else
        return Promise.resolve(true);
}

export const changeGameConfig = async (name: string, attributes: "channels" | "roles" | "rewards", addOrRemove: "add" | "remove", data: string[]): Promise<boolean> => {
    let game: game;
    const enabledGame = await getEnabledGame();
    if (enabledGame.name === name) {
        game = enabledGame;
    } else {
        let response = await fetch(`http://${API_URL}/api/v1/games?name=${name}`, {
            headers: {
                "Authorization": "Basic " + process.env._AUTH_TOKEN
            }
        });
        if (response.status === 400) return Promise.resolve(false);

        const data:any = await response.json();
        game = data.returnData.model as game;
    }

    switch (attributes) {
        case "rewards":
            const messagePoints = data[0];
            const threadPoints = data[1];
            if (messagePoints !== "0") {
                await fetch(`http://${API_URL}/api/v1/games/update?name=${name}&pointsPerMessage=${messagePoints}`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Basic " + process.env._AUTH_TOKEN
                    }
                });
                return Promise.resolve(true);
            } else {
                await fetch(`http://${API_URL}/api/v1/games/update?name=${name}&pointsPerThreadCreation=${threadPoints}`, {
                    method: "POST",
                    headers: {
                        "Authorization": "Basic " + process.env._AUTH_TOKEN
                    }
                });
                return Promise.resolve(true);
            }
        case "roles":
            let roleString: string = "";
            if (addOrRemove === "add") {
                game.roleIds.split(" ").forEach(role => {
                    roleString = roleString + role + " "
                });
                data.forEach(role => {
                    roleString = roleString + role + " ";
                })
            } else {
                game.roleIds.split(" ").forEach(role => {
                    if (!(data.some(element => element === role))) {
                        roleString = roleString + role + " "
                    }
                })
            }
            await fetch(`http://${API_URL}/api/v1/games/update?name=${name}&roleIds=${roleString}`, {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + process.env._AUTH_TOKEN
                }
            });
            return Promise.resolve(true);

        case "channels":
            let channelString: string = "";
            if (addOrRemove === "add") {
                game.channelIds.split(" ").forEach(channel => {
                    channelString = channelString + channel + " "
                });
                data.forEach(channel => {
                    channelString = channelString + channel + " ";
                })
            } else {
                game.channelIds.split(" ").forEach(channel => {
                    if (!(data.some(element => element === channel))) {
                        channelString = channelString + channel + " "
                    }
                })
            }
            await fetch(`http://${API_URL}/api/v1/games/update?name=${name}&channelIds=${channelString.replace(" ", "%20")}`, {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + process.env._AUTH_TOKEN
                }
            });
            return Promise.resolve(true);
    }


}