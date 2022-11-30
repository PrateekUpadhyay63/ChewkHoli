export interface MediaStanza{
    mediaUrl:string, 
    mediaSize:number, 
    mediaDuration?:number, 
    medidaThumbUrl?:string,
    mediaType?:string,
    types?:string,
    groupId:string,
    groupImageUrl:string
}

export enum medidaType {
    image = 2,
    video = 3,
    audio = 4,
}