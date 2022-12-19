type game = {
    id: number,
    name: string,
    channelIds: string,
    roleIds: string,
    pointsPerMessage: number,
    pointsPerThreadCreation: number,
    enabled: boolean
}


type pointsTableData = {
    id: number,
    userId: string,
    points: number
}[]