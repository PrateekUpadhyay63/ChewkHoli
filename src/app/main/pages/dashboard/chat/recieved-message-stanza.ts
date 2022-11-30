export interface RecievedMessageForText {
  messageId: string;
  senderName: string;
  senderFirstName: string;
  senderLastName: string;
  sendJid: string;
  senderId: number;
  sendImage: string;
  message: string;
  messageType: number;
  groupJid: string;
  groupId: string;
  unixTimeStamp: string;
}

export interface RecievedMessageForImage extends RecievedMessageForText {
  mediaImageUrl: string;
  mediaSize: string;
  medidaThumbUrl: string;
}

export interface RecievedMessageForAudio extends RecievedMessageForText {
  mediaSize: string;
  medidaAudioUrl: string;
  mediaAudioDuration: string;
}

export interface RecievedMessageForVideo extends RecievedMessageForText {
  mediaVideoUrl: string;
  mediaVideoThumbUrlUrl: string;
  mediaSize: string;
  mediaVideoDuration: string;
}

export interface RecievedMessageForDocument extends RecievedMessageForText {
  docUrl: string;
  docSize: number;
  docType: string;
}

export interface RecievedMessageForEventType extends RecievedMessageForText {
  eventType: number;
}

export interface RecivedQoutedMessageText extends RecievedMessageForText {
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
