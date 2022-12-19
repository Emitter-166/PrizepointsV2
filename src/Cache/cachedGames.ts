import * as Buffer from "buffer";
import * as path from "path";

let updatedAt:number;
let cachedEnabledGame:game = {
    id: 0,
    name: '',
    enabled: false,
    roleIds: '',
    channelIds: '',
    pointsPerMessage: 0,
    pointsPerThreadCreation: 0
};
const buf =  Buffer.Buffer;
const API_URL = "localhost:3000";

require('dotenv').config({
    path: path.join(__dirname, ".env")
});

export const getEnabledGame = async ():Promise<game>=> {
    if(cachedEnabledGame.name === ''){
        const response = (await fetch(`http://${API_URL}/api/v1/games?enabled=true`, {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + process.env._AUTH_TOKEN
            }
        }));
        const data = await response.json();

        if(response.status === 400){
            cachedEnabledGame = {
                id: 0,
                name: '',
                enabled: false,
                roleIds: '',
                channelIds:'',
                pointsPerMessage: 0,
                pointsPerThreadCreation: 0
            };
        }else if(response.status === 200){
            cachedEnabledGame = data.returnData.model as game;
            updatedAt = data.returnData.updatedAt;
        }
    }else{
        const response =await fetch(`http://${API_URL}/api/v1/cache/games?name=${cachedEnabledGame.name}&time=${updatedAt}`, {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + process.env._AUTH_TOKEN
            }
        })
        const data = await response.json();

        if(!Boolean(data.valid)){
            const response = await fetch(`http://${API_URL}/api/v1/games?enabled=true`, {
                method: "GET",
                headers: {
                    'Authorization': 'Basic ' + process.env._AUTH_TOKEN
                }
            });
            const data = await response.json();
            if(response.status === 400){
                cachedEnabledGame = {
                    id: 0,
                    name: '',
                    enabled: false,
                    roleIds: '',
                    channelIds: '',
                    pointsPerMessage: 0,
                    pointsPerThreadCreation: 0
                };
            }else{
                cachedEnabledGame = data.returnData.model as game;
                updatedAt = data.returnData.updatedAt;
            }
        }
    }
    return  Promise.resolve(cachedEnabledGame as game);
}
