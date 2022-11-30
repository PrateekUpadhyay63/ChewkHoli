export interface sendMessage {
  toGroup: string;
  message: string;
  groupId: string;
  groupImageUrl: string;
  groupName: string;
}

export interface Idocument {
  toGroup: string;
  groupId: string;
  groupImageUrl: string;
  groupName: string;
  mediaType: string;
  docUrl: string;
  docSize: number;
  docType: string;
}

export interface IEventMessage {
  toGroup: string;
  message: string;
  groupId: string;
  groupImageUrl: string;
  groupName: string;
  eventType: number;
}

export interface sendDeliveredORDisplayedAck {
  groupJid: string;
  senderJid: string;
  messageId: string;
}

export interface sendQuotedMessage extends sendMessage {
  quotedmessageId: string;
  quotedsenderName: string;
  quotedsendJid: string;
  quotedsenderId: number;
  quotedsendImage: string;
  quotedmessage: string;
  quotedmessageType: number;
  quotedsenderfirstname: string;
  quotedsenderlastname: string;
}
export interface unreadMessageData {
  roomJid: string;
  timeStamp: string;
}
export interface sendMsgData {
  groupJid: string;
  senderJid: string;
  messageId: string;
  timestamp: string;
  groupId: string;
}
