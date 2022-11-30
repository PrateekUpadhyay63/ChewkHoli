export interface onMessageDelivered{
    messageId:string;
    groupJid:string;
    senderJid:string;
    delivered:string;
}

export interface onMessageSeen{
    messageId:string;
    groupJid:string;
    senderJid:string;
    displayed:string;
}

export interface onTypyingStanzaRecieved {
    isTypingStanza:boolean;
    groupJid:string;
    senderJid:string;
    senderName:string;
    senderFirstName:string;
    senderLastName:string;
}