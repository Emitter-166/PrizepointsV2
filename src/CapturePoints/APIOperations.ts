import {AnyThreadChannel} from "discord.js";
import {getEnabledGame} from "../Cache/cachedGames";
import {API_URL} from "../index";

export const incrementPoints = async (points: number, userId: string, game:game, bonus?: number ) => {
    console.log({userId, points, bonus})
    const beforePoints = await getUserPoints(userId, game);
    if(bonus === undefined) bonus = 0;
    const toSetPoints  = beforePoints + points + bonus;
    await setUserPoints(userId, toSetPoints, game);
}
export const pointsTableCache = new Map<string, number>();


export const getUserPoints = async (userId: string, game: game): Promise<number> => {
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
            await setUserPoints(userId, 0, game)
            result = 0;
        }
    }
    return Promise.resolve(result);
}

export const setUserPoints = async (userId: string, points: number, game:game) => {
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
        await fetch(`http://${API_URL}/api/v1/threads?threadId=${threadId}&points=${points}`, {
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
            await fetch(`http://${API_URL}/api/v1/threads?threadId=${threadId}&points=${threadPoints + points}`, {
                headers: {
                    "Authorization": "Basic " + process.env._AUTH_TOKEN
                }
            });
            return false;
        }
    }
}