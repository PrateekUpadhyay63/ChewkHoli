import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { BehaviorSubject, from, Observable } from "rxjs";
import { Strophe, $msg, $pres, $iq } from "../../../../assets/strophe.js";
import { ChatsService } from "./chat/chats.service";
import {
  RecievedMessageForAudio,
  RecievedMessageForDocument,
  RecievedMessageForEventType,
  RecievedMessageForImage,
  RecievedMessageForText,
  RecievedMessageForVideo,
  RecivedQoutedMessageText,
} from "./chat/recieved-message-stanza";
import { MediaStanza } from "./chat/media-share-stanza";
import { CurrentUserData } from "./chat/sender-data";
import {
  Idocument,
  IEventMessage,
  sendDeliveredORDisplayedAck,
  sendMessage,
  sendMsgData,
  sendQuotedMessage,
  unreadMessageData,
} from "./chat/send-message";
import {
  onMessageDelivered,
  onMessageSeen,
  onTypyingStanzaRecieved,
} from "./chat/utils/message-status-stanza";
import { onGroupUpdateSend } from "./chat/utils/group-update";
import { MediaTypesEnum } from "./chat/utils/media-type-enum";

var bind = function (fn, me) {
  return function () {
    return fn.apply(me, arguments);
  };
};

var XmppRoom = (function () {
  function XmppRoom(client, name, nick1, password1) {
    this.client = client;
    this.name = name;
    this.nick = nick1;
    this.password = password1;
    this._roomRosterHandler = bind(this._roomRosterHandler, this);
    this._addOccupant = bind(this._addOccupant, this);
    this.roster = {};
    this._message_handlers = {};
    this._presence_handlers = {};
    this._roster_handlers = {};
    this._handler_ids = 0;
    if (this.client.muc) {
      this.client = this.client.muc;
    }
    this.name = Strophe.getBareJidFromJid(this.name);
    this.addHandler("presence", this._roomRosterHandler);
  }

  XmppRoom.prototype.join = function (
    msg_handler_cb,
    pres_handler_cb,
    roster_cb
  ) {
    return this.client.join(
      this.name,
      this.nick,
      msg_handler_cb,
      pres_handler_cb,
      roster_cb,
      this.password
    );
  };

  XmppRoom.prototype.leave = function (handler_cb, message) {
    this.client.leave(this.name, this.nick, handler_cb, message);
    return delete this.client.rooms[this.name];
  };

  XmppRoom.prototype.message = function (nick, message, html_message, type) {
    return this.client.message(this.name, nick, message, html_message, type);
  };

  XmppRoom.prototype.groupchat = function (message, html_message) {
    return this.client.groupchat(this.name, message, html_message);
  };

  XmppRoom.prototype.invite = function (receiver, reason) {
    return this.client.invite(this.name, receiver, reason);
  };

  XmppRoom.prototype.multipleInvites = function (receivers, reason) {
    return this.client.invite(this.name, receivers, reason);
  };

  XmppRoom.prototype.directInvite = function (receiver, reason) {
    return this.client.directInvite(this.name, receiver, reason, this.password);
  };

  XmppRoom.prototype.configure = function (handler_cb) {
    return this.client.configure(this.name, handler_cb);
  };

  XmppRoom.prototype.cancelConfigure = function () {
    return this.client.cancelConfigure(this.name);
  };

  XmppRoom.prototype.saveConfiguration = function (config) {
    return this.client.saveConfiguration(this.name, config);
  };

  XmppRoom.prototype.queryOccupants = function (success_cb, error_cb) {
    return this.client.queryOccupants(this.name, success_cb, error_cb);
  };

  XmppRoom.prototype.setTopic = function (topic) {
    return this.client.setTopic(this.name, topic);
  };

  XmppRoom.prototype.modifyRole = function (
    nick,
    role,
    reason,
    success_cb,
    error_cb
  ) {
    return this.client.modifyRole(
      this.name,
      nick,
      role,
      reason,
      success_cb,
      error_cb
    );
  };

  XmppRoom.prototype.kick = function (nick, reason, handler_cb, error_cb) {
    return this.client.kick(this.name, nick, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.voice = function (nick, reason, handler_cb, error_cb) {
    return this.client.voice(this.name, nick, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.mute = function (nick, reason, handler_cb, error_cb) {
    return this.client.mute(this.name, nick, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.op = function (nick, reason, handler_cb, error_cb) {
    return this.client.op(this.name, nick, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.deop = function (nick, reason, handler_cb, error_cb) {
    return this.client.deop(this.name, nick, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.modifyAffiliation = function (
    jid,
    affiliation,
    reason,
    success_cb,
    error_cb
  ) {
    return this.client.modifyAffiliation(
      this.name,
      jid,
      affiliation,
      reason,
      success_cb,
      error_cb
    );
  };

  XmppRoom.prototype.ban = function (jid, reason, handler_cb, error_cb) {
    return this.client.ban(this.name, jid, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.member = function (jid, reason, handler_cb, error_cb) {
    return this.client.member(this.name, jid, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.revoke = function (jid, reason, handler_cb, error_cb) {
    return this.client.revoke(this.name, jid, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.owner = function (jid, reason, handler_cb, error_cb) {
    return this.client.owner(this.name, jid, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.admin = function (jid, reason, handler_cb, error_cb) {
    return this.client.admin(this.name, jid, reason, handler_cb, error_cb);
  };

  XmppRoom.prototype.changeNick = function (nick1) {
    this.nick = nick1;
    return this.client.changeNick(this.name, this.nick);
  };

  XmppRoom.prototype.setStatus = function (show, status) {
    return this.client.setStatus(this.name, this.nick, show, status);
  };

  /*Function
    Adds a handler to the MUC room.
      Parameters:
    (String) handler_type - 'message', 'presence' or 'roster'.
    (Function) handler - The handler function.
    Returns:
    id - the id of handler.
     */

  XmppRoom.prototype.addHandler = function (handler_type, handler) {
    var id;
    id = this._handler_ids++;
    switch (handler_type) {
      case "presence":
        this._presence_handlers[id] = handler;
        break;
      case "message":
        this._message_handlers[id] = handler;
        break;
      case "roster":
        this._roster_handlers[id] = handler;
        break;
      default:
        this._handler_ids--;
        return null;
    }
    return id;
  };

  /*Function
    Removes a handler from the MUC room.
    This function takes ONLY ids returned by the addHandler function
    of this room. passing handler ids returned by connection.addHandler
    may brake things!
      Parameters:
    (number) id - the id of the handler
     */

  XmppRoom.prototype.removeHandler = function (id) {
    delete this._presence_handlers[id];
    delete this._message_handlers[id];
    return delete this._roster_handlers[id];
  };

  /*Function
    Creates and adds an Occupant to the Room Roster.
      Parameters:
    (Object) data - the data the Occupant is filled with
    Returns:
    occ - the created Occupant.
     */

  XmppRoom.prototype._addOccupant = function (data) {
    var occ;
    occ = new Occupant(data, this);
    this.roster[occ.nick] = occ;
    return occ;
  };

  /*Function
    The standard handler that managed the Room Roster.
      Parameters:
    (Object) pres - the presence stanza containing user information
     */

  XmppRoom.prototype._roomRosterHandler = function (pres) {
    var data, handler, id, newnick, nick, ref;
    data = XmppRoom._parsePresence(pres);
    nick = data.nick;
    newnick = data.newnick || null;
    switch (data.type) {
      case "error":
        return true;
      case "unavailable":
        if (newnick) {
          data.nick = newnick;
          if (this.roster[nick] && this.roster[newnick]) {
            this.roster[nick].update(this.roster[newnick]);
            this.roster[newnick] = this.roster[nick];
          }
          if (this.roster[nick] && !this.roster[newnick]) {
            this.roster[newnick] = this.roster[nick].update(data);
          }
        }
        delete this.roster[nick];
        break;
      default:
        if (this.roster[nick]) {
          this.roster[nick].update(data);
        } else {
          this._addOccupant(data);
        }
    }
    ref = this._roster_handlers;
    for (id in ref) {
      handler = ref[id];
      if (!handler(this.roster, this)) {
        delete this._roster_handlers[id];
      }
    }
    return true;
  };

  /*Function
    Parses a presence stanza
      Parameters:
    (Object) data - the data extracted from the presence stanza
     */

  XmppRoom._parsePresence = function (pres) {
    var c, c2, data, i, j, len, len1, ref, ref1, ref2;
    data = {};
    data.nick = Strophe.getResourceFromJid(pres.getAttribute("from"));
    data.type = pres.getAttribute("type");
    data.states = [];
    ref = pres.childNodes;
    for (i = 0, len = ref.length; i < len; i++) {
      c = ref[i];
      switch (c.nodeName) {
        case "error":
          data.errorcode = c.getAttribute("code");
          data.error =
            (ref1 = c.childNodes[0]) != null ? ref1.nodeName : void 0;
          break;
        case "status":
          data.status = c.textContent || null;
          break;
        case "show":
          data.show = c.textContent || null;
          break;
        case "x":
          if (c.getAttribute("xmlns") === Strophe.NS.MUC_USER) {
            ref2 = c.childNodes;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              c2 = ref2[j];
              switch (c2.nodeName) {
                case "item":
                  data.affiliation = c2.getAttribute("affiliation");
                  data.role = c2.getAttribute("role");
                  data.jid = c2.getAttribute("jid");
                  data.newnick = c2.getAttribute("nick");
                  break;
                case "status":
                  if (c2.getAttribute("code")) {
                    data.states.push(c2.getAttribute("code"));
                  }
              }
            }
          }
      }
    }
    return data;
  };

  return XmppRoom;
})();

var Occupant = (function () {
  function Occupant(data, room1) {
    this.room = room1;
    this.update = bind(this.update, this);
    this.admin = bind(this.admin, this);
    this.owner = bind(this.owner, this);
    this.revoke = bind(this.revoke, this);
    this.member = bind(this.member, this);
    this.ban = bind(this.ban, this);
    this.modifyAffiliation = bind(this.modifyAffiliation, this);
    this.deop = bind(this.deop, this);
    this.op = bind(this.op, this);
    this.mute = bind(this.mute, this);
    this.voice = bind(this.voice, this);
    this.kick = bind(this.kick, this);
    this.modifyRole = bind(this.modifyRole, this);
    this.update(data);
  }

  Occupant.prototype.modifyRole = function (
    role,
    reason,
    success_cb,
    error_cb
  ) {
    return this.room.modifyRole(this.nick, role, reason, success_cb, error_cb);
  };

  Occupant.prototype.kick = function (reason, handler_cb, error_cb) {
    return this.room.kick(this.nick, reason, handler_cb, error_cb);
  };

  Occupant.prototype.voice = function (reason, handler_cb, error_cb) {
    return this.room.voice(this.nick, reason, handler_cb, error_cb);
  };

  Occupant.prototype.mute = function (reason, handler_cb, error_cb) {
    return this.room.mute(this.nick, reason, handler_cb, error_cb);
  };

  Occupant.prototype.op = function (reason, handler_cb, error_cb) {
    return this.room.op(this.nick, reason, handler_cb, error_cb);
  };

  Occupant.prototype.deop = function (reason, handler_cb, error_cb) {
    return this.room.deop(this.nick, reason, handler_cb, error_cb);
  };

  Occupant.prototype.modifyAffiliation = function (
    affiliation,
    reason,
    success_cb,
    error_cb
  ) {
    return this.room.modifyAffiliation(
      this.jid,
      affiliation,
      reason,
      success_cb,
      error_cb
    );
  };

  Occupant.prototype.ban = function (reason, handler_cb, error_cb) {
    return this.room.ban(this.jid, reason, handler_cb, error_cb);
  };

  Occupant.prototype.member = function (reason, handler_cb, error_cb) {
    return this.room.member(this.jid, reason, handler_cb, error_cb);
  };

  Occupant.prototype.revoke = function (reason, handler_cb, error_cb) {
    return this.room.revoke(this.jid, reason, handler_cb, error_cb);
  };

  Occupant.prototype.owner = function (reason, handler_cb, error_cb) {
    return this.room.owner(this.jid, reason, handler_cb, error_cb);
  };

  Occupant.prototype.admin = function (reason, handler_cb, error_cb) {
    return this.room.admin(this.jid, reason, handler_cb, error_cb);
  };

  Occupant.prototype.update = function (data) {
    this.nick = data.nick || null;
    this.affiliation = data.affiliation || null;
    this.role = data.role || null;
    this.jid = data.jid || null;
    this.status = data.status || null;
    this.show = data.show || null;
    return this;
  };

  return Occupant;
})();

@Injectable({
  providedIn: "root",
})
export class XMPPService {
  rooms = {};
  roomNames = [];
  private dismissObserver: any;
  public dismiss: any;
  private BOSH_SERVICE: string = `wss://${environment.domainUrl}:${environment.domainPort}/ws/`;
  private CONFERENCE_SERVICE: string = `conference.${environment.domainUrl}`;
  private connection: Strophe.Connection;
  private roomName: string = "";
  private _muc_handler;
  public textMessage: RecievedMessageForText; // for text message
  public imageMessage: RecievedMessageForImage; // for image message
  public audioMessage: RecievedMessageForAudio; // for audio message
  public videoMessage: RecievedMessageForVideo; // for video message
  public documentMessage: RecievedMessageForDocument; // for document message
  public eventMessage: RecievedMessageForEventType; // for event meesage
  public currentUserData: CurrentUserData; // for current logged In user Data.
  public isTypingStanza: onTypyingStanzaRecieved; // for typing status
  public onMessageDelivered: onMessageDelivered; // for message delivered Akc.
  public onMessageSeen: onMessageSeen; // for message seen ack.
  public sendMessageDelivedAck: sendDeliveredORDisplayedAck; // send recipt for msg received.
  public sendQoutedMessage: sendQuotedMessage; // send qouted message.
  public ReceivedQoutedMessage: RecivedQoutedMessageText; // Recieved quoted text message
  public messageObject = new BehaviorSubject<any>(null);
  public typingObject = new BehaviorSubject<any>(null);
  public clickGroupChat = new BehaviorSubject<any>(null);

  public clickMembersList = new BehaviorSubject<boolean>(false);
  public clickMapDiv = new BehaviorSubject<boolean>(false);
  public isFullScreenMode = new BehaviorSubject<boolean>(false);

  constructor(private chatsSvc: ChatsService) {
    this.dismissObserver = null;
    this.dismiss = Observable.create((observer) => {
      this.dismissObserver = observer;
    });
    // const loggedInUserData = JSON.parse((localStorage.getItem("currentUser")));
    // this.currentUserData = {
    //     name : loggedInUserData.name ? loggedInUserData.name : '',
    //     sender_id: loggedInUserData.id ? loggedInUserData.id : '',
    //     sender_image:  loggedInUserData.profile_image ? loggedInUserData.profile_image : '',
    //     sender_jid:  loggedInUserData.jid ? loggedInUserData.jid : '',
    //     first_name: loggedInUserData.first_name ? loggedInUserData.first_name : '',
    //     last_name: loggedInUserData.last_name ? loggedInUserData.last_name : ''
    // }
  }

  /*Function
        Connects the client from the Jabber server.
      Parameters:
        (String) jid - Jabber id.
        (String) host - Host name.
        (String) pass - Password.
      Returns:
    */

  login(jid, pass) {
    this.connection = new Strophe.Connection(this.BOSH_SERVICE, {
      keepalive: true,
    });
    this.connection.reset();
    this.connection.connect(jid, pass, (status) => {
      // console.log("status",this.connection);
      this.onConnect(status);
    });
  }

  /*Function
        Create multi-user chat room.
      Parameters:
        (String) roomName - The multi-user chat room name.
      Returns:
      id - the unique id used to create the chat room.
    */
  createInstantRoom(roomName, success_cb, error_cb) {
    var roomiq;

    let nick = this.getNick();
    let roomId = roomName + "-" + this.unixTimestamp();
    let roomJid = roomId + "@" + this.CONFERENCE_SERVICE;
    let room = roomJid + "/" + nick;

    roomiq = $iq({
      to: room,
      type: "set",
    })
      .c("query", {
        xmlns: Strophe.NS.MUC_OWNER,
      })
      .c("x", {
        xmlns: "jabber:x:data",
        type: "submit",
      });
    return this.connection.sendIQ(roomiq.tree(), success_cb, error_cb);
  }

  /**
   * It sends the presence to the room, meaning that you are joining it. If it does not exist it will be created.
   * @param roomName
   */
  createGroup(roomName) {
    let nick = this.getNick();
    let roomJid = roomName + "@" + this.CONFERENCE_SERVICE;
    let room = roomJid + "/" + nick;
    var presence = $pres({
      to: room,
      from: Strophe.getBareJidFromJid(this.connection.jid),
    });
    this.connection.send(presence.tree());
    // console.info('I created and joined the room: ', room, ': ', presence.tree());
  }

  // Set room name.
  setRoomName(roomName) {
    this.roomName = roomName;
  }
  // Get room Name
  getRoomName() {
    return this.roomName;
  }

  // Create timestamp for multi-user chat room id.
  unixTimestamp() {
    return Math.floor(Date.now());
  }

  // time stamp
  timeStamp() {
    return new Date().toISOString();
  }

  // Parse nickname of jabber id.
  getNick() {
    let nick = this.connection.jid;
    nick = nick.substring(0, nick.indexOf("@"));
    return nick;
  }

  /*Function
        Disconnects the client from the Jabber server.
      Parameters:
      Returns:
    */

  logout() {
    if (this.connection) {
      this.connection.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
      this.connection.flush();
      this.connection.disconnect("logout");
      // console.log("logout connection", this.connection);

      // this.connection = null;
    }
  }

  // user data
  getUserData() {
    const loggedInUserData = JSON.parse(localStorage.getItem("currentUser"));
    this.currentUserData = {
      name: loggedInUserData.name ? loggedInUserData.name : "",
      sender_id: loggedInUserData.id ? loggedInUserData.id : "",
      sender_image: loggedInUserData.profile_image
        ? loggedInUserData.profile_image
        : "",
      sender_jid: loggedInUserData.jid ? loggedInUserData.jid : "",
      first_name: loggedInUserData.first_name
        ? loggedInUserData.first_name
        : "",
      last_name: loggedInUserData.last_name ? loggedInUserData.last_name : "",
    };
  }

  /*Function
        Connect XMPP.
      Parameters:    
      Returns:
        status - Status of connection.
    */
  onConnect(status) {
    var self = this;

    switch (status) {
      case Strophe.Status.CONNECTED:
        // console.log("[Connection] Strophe is Connected", this.timeStamp());
        this.connection.xmlOutput = function (elem) {
          // console.log("ele",elem);
        };
        // console.log("rid and sid", this.connection._proto.rid,  this.connection._protoction.sid );
        this.onRoomJoin();
        self.connection.addHandler(
          function (msg) {
            return self.onMessage(msg);
          },
          null,
          "message",
          null,
          null,
          null
        );
        self.connection.send($pres().tree());
        this.dismissObserver.next("login");
        break;
      case Strophe.Status.ATTACHED:
        console.log("[Connection] Strophe is Attached");
        break;

      case Strophe.Status.DISCONNECTED:
        const loggedInUserData = JSON.parse(
          localStorage.getItem("currentUser")
        );
        // console.log("[Connection] Strophe is Disconnected", this.timeStamp());
        if (loggedInUserData) {
          this.login(loggedInUserData.jid, loggedInUserData.jid_password);
        }
        this.dismissObserver.next("logout");
        break;

      case Strophe.Status.AUTHFAIL:
        console.log("[Connection] Strophe is Authentication failed");
        break;

      case Strophe.Status.CONNECTING:
        // console.log("[Connection] Strophe is Connecting");
        break;

      case Strophe.Status.DISCONNECTING:
        console.log("[Connection] Strophe is Disconnecting");
        break;

      case Strophe.Status.AUTHENTICATING:
        console.log("[Connection] Strophe is Authenticating");
        break;

      case Strophe.Status.ERROR:
      case Strophe.Status.CONNFAIL:
        // console.log("[Connection] Failed (" + status + ")");
        break;

      default:
        console.log("[Connection] Unknown status received:", status);
        break;
    }
  }

  // send simple text message
  sendMessage(textMessage: sendMessage, type = "groupchat") {
    this.getUserData();
    let reply;
    const msgId = this.connection.getUniqueId();
    const unixTimestap = this.unixTimestamp();
    if (type == "groupchat") {
      reply = $msg({
        to: textMessage.toGroup,
        from: this.connection.jid,
        type,
        id: msgId,
      })
        .c("body", {})
        .t(textMessage.message);
      reply
        .up()
        .c("data", { xmlns: "data:jabber" })
        .c("messageId", {}, msgId)
        .c("to", {}, textMessage.groupName)
        .c("groupId", {}, textMessage.groupId)
        .c("groupJid", {}, textMessage.toGroup)
        .c("groupImageUrl", {}, textMessage.groupImageUrl || "")
        .c("timestamp", {}, this.timeStamp())
        .c("unixtimestamp", {}, unixTimestap)
        .c("mediaType", {}, "1")
        .c("senderName", {}, this.currentUserData.name)
        .c("senderFirstName", {}, this.currentUserData.first_name)
        .c("senderLastName", {}, this.currentUserData.last_name)
        .c("senderImageUrl", {}, this.currentUserData.sender_image)
        .c("senderJid", {}, this.currentUserData.sender_jid)
        .c("senderId", {}, this.currentUserData.sender_id);
    }
    let replyToAdmin;
    replyToAdmin = $msg({
      to: environment.adminJid,
      from: this.connection.jid,
      type: "chat",
      id: msgId,
    })
      .c("body", {})
      .t(textMessage.message);
    replyToAdmin
      .up()
      .c("data", { xmlns: "data:jabber" })
      .c("messageId", {}, msgId)
      .c("to", {}, textMessage.groupName)
      .c("groupId", {}, textMessage.groupId)
      .c("groupJid", {}, textMessage.toGroup)
      .c("groupImageUrl", {}, textMessage.groupImageUrl || "")
      .c("timestamp", {}, this.timeStamp())
      .c("unixtimestamp", {}, unixTimestap)
      .c("mediaType", {}, "1")
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderImageUrl", {}, this.currentUserData.sender_image)
      .c("senderJid", {}, this.currentUserData.sender_jid)
      .c("senderId", {}, this.currentUserData.sender_id);
    this.connection.send(reply.tree());
    this.connection.send(replyToAdmin.tree());

    console.info(
      "I sent ",
      textMessage.toGroup,
      ": " + textMessage.message,
      reply.tree()
    );
    // console.info(
    //   "I sent ",
    //   textMessage.toGroup,
    //   ": " + textMessage.message,
    //   replyToAdmin.tree()
    // );
  }

  onRoster = (msg) => {
    // console.log("called IQ...", msg);
  };
  // on message receive fillter all msg A/c to groups and media type
  onMessage(msg) {
    // console.log("recieved stanza", msg);
    var to = msg.getAttribute("to");
    var from = msg.getAttribute("from");
    var type = msg.getAttribute("type");
    var elems = msg.getElementsByTagName("body");
    let senderImageUrl = Strophe.getText(
      msg.getElementsByTagName("senderImageUrl")[0]
    );
    let senderName = Strophe.getText(msg.getElementsByTagName("senderName")[0]);
    let senderFisrtName = Strophe.getText(
      msg.getElementsByTagName("senderFirstName")[0]
    );
    let senderLastName = Strophe.getText(
      msg.getElementsByTagName("senderLastName")[0]
    );
    let senderJid = Strophe.getText(msg.getElementsByTagName("senderJid")[0]);
    let senderId = Strophe.getText(msg.getElementsByTagName("senderId")[0]);
    let messageId = Strophe.getText(msg.getElementsByTagName("messageId")[0]);
    let mediaType = Strophe.getText(msg.getElementsByTagName("mediaType")[0]);
    let groupId = Strophe.getText(msg.getElementsByTagName("groupId")[0]);
    let groupJid = Strophe.getText(msg.getElementsByTagName("groupJid")[0]);
    let unixTimestap = Strophe.getText(
      msg.getElementsByTagName("unixtimestamp")[0]
    );
    // varible for element or tag is present.
    let mediaData = msg.getElementsByTagName("mediaData");
    let docData = msg.getElementsByTagName("docData");
    let typingStanza = msg.getElementsByTagName("composing");
    let deliveredTag = msg.getElementsByTagName("delivered");
    let displayedTag = msg.getElementsByTagName("displayed");
    let eventTypeTag = msg.getElementsByTagName("eventData");
    let replayMessageTag = msg.getElementsByTagName("replyMessage");
    this.sendMessageDelivedAck = {
      senderJid: senderJid,
      groupJid: groupJid,
      messageId: messageId,
    };
    if (type == "groupchat" && elems.length > 0) {
      // console.info('CHAT: I got a message from ' ,msg.getElementsByTagName("body"));
      // console.log("reply",replayMessageTag.length);
      
      // For text, image, audio, video, document and event Message...
      if (replayMessageTag.length <= 0) {
        if (mediaType === MediaTypesEnum.textMessage) {
          // for text message
          const message = Strophe.getText(msg.getElementsByTagName("body")[0]);
          this.textMessage = {
            messageId: messageId,
            senderName: senderName,
            sendJid: senderJid,
            senderId: senderId,
            sendImage: senderImageUrl,
            message: message,
            messageType: mediaType,
            groupJid: groupJid,
            groupId: groupId,
            unixTimeStamp: unixTimestap,
            senderFirstName: senderFisrtName,
            senderLastName: senderLastName,
          };
          this.messageObject.next(this.textMessage);
          // console.log("obj", this.textMessage);
          // send delived ack for msged we received...
          this.sendDeliveredMsgAck(this.sendMessageDelivedAck);
        } else if (mediaType === MediaTypesEnum.imageMessage && mediaData.length > 0) {
          // for image message
          let message = Strophe.getText(msg.getElementsByTagName("body")[0]);
          let mediaUrl = Strophe.getText(
            msg.getElementsByTagName("mediaUrl")[0]
          );
          let mediaSize = Strophe.getText(
            msg.getElementsByTagName("mediaSize")[0]
          );
          let mediaThumbImageUrl = Strophe.getText(
            msg.getElementsByTagName("mediaThumbImageUrl")[0]
          );
          this.imageMessage = {
            messageId: messageId,
            senderName: senderName,
            sendJid: senderJid,
            senderId: senderId,
            sendImage: senderImageUrl,
            message: message,
            messageType: mediaType,
            groupJid: groupJid,
            groupId: groupId,
            unixTimeStamp: unixTimestap,
            mediaImageUrl: mediaUrl,
            mediaSize: mediaSize,
            medidaThumbUrl: mediaThumbImageUrl,
            senderFirstName: senderFisrtName,
            senderLastName: senderLastName,
          };
          this.messageObject.next(this.imageMessage);
          this.sendDeliveredMsgAck(this.sendMessageDelivedAck);
        } else if (mediaType === MediaTypesEnum.videoMessage && mediaData.length > 0) {
          // for video message
          // console.log("if ", mediaType);
          let message = Strophe.getText(msg.getElementsByTagName("body")[0]);
          let mediaUrl = Strophe.getText(
            msg.getElementsByTagName("mediaUrl")[0]
          );
          let mediaSize = Strophe.getText(
            msg.getElementsByTagName("mediaSize")[0]
          );
          let mediaThumbImageUrl = Strophe.getText(
            msg.getElementsByTagName("mediaThumbImageUrl")[0]
          );
          let mediaDuration = Strophe.getText(
            msg.getElementsByTagName("mediaDuration")[0]
          );
          this.videoMessage = {
            messageId: messageId,
            senderName: senderName,
            sendJid: senderJid,
            senderId: senderId,
            sendImage: senderImageUrl,
            message: message,
            messageType: mediaType,
            groupJid: groupJid,
            groupId: groupId,
            unixTimeStamp: unixTimestap,
            mediaVideoUrl: mediaUrl,
            mediaSize: mediaSize,
            mediaVideoDuration: mediaDuration,
            mediaVideoThumbUrlUrl: mediaThumbImageUrl,
            senderFirstName: senderFisrtName,
            senderLastName: senderLastName,
          };
          this.messageObject.next(this.videoMessage);
          this.sendDeliveredMsgAck(this.sendMessageDelivedAck);
        } else if (mediaType === MediaTypesEnum.audioMessage && mediaData.length > 0) {
          // for audio message
          let message = Strophe.getText(msg.getElementsByTagName("body")[0]);
          let mediaUrl = Strophe.getText(
            msg.getElementsByTagName("mediaUrl")[0]
          );
          let mediaSize = Strophe.getText(
            msg.getElementsByTagName("mediaSize")[0]
          );
          let mediaDuration = Strophe.getText(
            msg.getElementsByTagName("mediaDuration")[0]
          );
          this.audioMessage = {
            messageId: messageId,
            senderName: senderName,
            sendJid: senderJid,
            senderId: senderId,
            sendImage: senderImageUrl,
            message: message,
            messageType: mediaType,
            groupJid: groupJid,
            groupId: groupId,
            unixTimeStamp: unixTimestap,
            medidaAudioUrl: mediaUrl,
            mediaSize: mediaSize,
            mediaAudioDuration: mediaDuration,
            senderFirstName: senderFisrtName,
            senderLastName: senderLastName,
          };
          this.messageObject.next(this.audioMessage);
          this.sendDeliveredMsgAck(this.sendMessageDelivedAck);
        } else if (mediaType === MediaTypesEnum.documentMessage && docData.length > 0) {
          // for doucment
          let message = Strophe.getText(msg.getElementsByTagName("body")[0]);
          let mediaUrl = Strophe.getText(msg.getElementsByTagName("docUrl")[0]);
          let mediaSize = Strophe.getText(
            msg.getElementsByTagName("docSize")[0]
          );
          let docType = Strophe.getText(msg.getElementsByTagName("docType")[0]);
          this.documentMessage = {
            messageId: messageId,
            senderName: senderName,
            sendJid: senderJid,
            senderId: senderId,
            sendImage: senderImageUrl,
            message: message,
            messageType: mediaType,
            groupJid: groupJid,
            groupId: groupId,
            unixTimeStamp: unixTimestap,
            docUrl: mediaUrl,
            docSize: mediaSize,
            docType: docType,
            senderFirstName: senderFisrtName,
            senderLastName: senderLastName,
          };
          this.messageObject.next(this.documentMessage);
          this.sendDeliveredMsgAck(this.sendMessageDelivedAck);
          // console.log("docment msg", this.documentMessage);
        } else if (mediaType === MediaTypesEnum.eventMessage && eventTypeTag.length > 0) {
          let message = Strophe.getText(msg.getElementsByTagName("body")[0]);
          let eventType = Strophe.getText(
            msg.getElementsByTagName("eventType")[0]
          );
          this.eventMessage = {
            messageId: messageId,
            senderName: senderName,
            sendJid: senderJid,
            senderId: senderId,
            sendImage: senderImageUrl,
            message: message,
            messageType: mediaType,
            groupJid: groupJid,
            groupId: groupId,
            unixTimeStamp: unixTimestap,
            eventType: eventType,
            senderFirstName: senderFisrtName,
            senderLastName: senderLastName,
          };
          this.messageObject.next(this.eventMessage);
        }
      }

      // For Qouted Message
      if (replayMessageTag) {
        if (replayMessageTag.length > 0) {
          const message = Strophe.getText(msg.getElementsByTagName("body")[0]);
          const quotedmessageId = Strophe.getText(
            msg.getElementsByTagName("replyMessageId")[0]
          );
          const quotedsenderName = Strophe.getText(
            msg.getElementsByTagName("replySenderName")[0]
          );
          const quotedsendJid = Strophe.getText(
            msg.getElementsByTagName("replySenderJid")[0]
          );
          const quotedsenderId = Strophe.getText(
            msg.getElementsByTagName("replySenderId")[0]
          );
          const quotedsendImage = Strophe.getText(
            msg.getElementsByTagName("replySenderImageUrl")[0]
          );
          const quotedmessage = Strophe.getText(
            msg.getElementsByTagName("replyBody")[0]
          );
          const quotedmessageType = Strophe.getText(
            msg.getElementsByTagName("replyMediaType")[0]
          );
          const quotedsenderfirstname = Strophe.getText(
            msg.getElementsByTagName("replySenderFirstName")[0]
          );
          const quotedsenderlastname = Strophe.getText(
            msg.getElementsByTagName("replySenderLastName")[0]
          );
          this.ReceivedQoutedMessage = {
            messageId: messageId,
            senderName: senderName,
            sendJid: senderJid,
            senderId: senderId,
            sendImage: senderImageUrl,
            message: message,
            messageType: 9, // later A/c client req. change
            groupJid: groupJid,
            groupId: groupId,
            unixTimeStamp: unixTimestap,
            senderFirstName: senderFisrtName,
            senderLastName: senderLastName,
            quotedmessageId: quotedmessageId,
            quotedsenderName: quotedsenderName,
            quotedsendJid: quotedsendJid,
            quotedsenderId: quotedsenderId,
            quotedsendImage: quotedsendImage,
            quotedmessage: quotedmessage,
            quotedmessageType: quotedmessageType,
            quotedsenderfirstname: quotedsenderfirstname,
            quotedsenderlastname: quotedsenderlastname,
          };
          this.messageObject.next(this.ReceivedQoutedMessage);
          // send delived ack for msged we received...
          // console.log("replyed message", this.ReceivedQoutedMessage);
          this.sendDeliveredMsgAck(this.sendMessageDelivedAck);
        }
      }
    }
    // For typing status
    // console.log(typingStanza, deliveredTag, Strophe.getText(msg.getElementsByTagName('body')[0]));
    if (typingStanza.length > 0 && type == "groupchat") {
      let senderFirstName = Strophe.getText(
        msg.getElementsByTagName("senderFirstName")[0]
      );
      let senderLastName = Strophe.getText(
        msg.getElementsByTagName("senderLastName")[0]
      );
      this.isTypingStanza = {
        senderName: senderName,
        senderJid: senderJid,
        senderFirstName: senderFirstName,
        senderLastName: senderLastName,
        groupJid: groupJid,
        isTypingStanza: true,
      };
      // console.log("tyoing status", this.isTypingStanza);
      this.typingObject.next(this.isTypingStanza);
    } else if (deliveredTag.length > 0 && type == "chat") {
      // console.log("condition checked");
      let delivered = Strophe.getText(msg.getElementsByTagName("delivered")[0]);
      this.onMessageDelivered = {
        senderJid: senderJid,
        delivered: delivered,
        groupJid: groupJid,
        messageId: messageId,
      };
      // console.log("delivered ack", this.onMessageDelivered);
      this.typingObject.next(this.onMessageDelivered);
    } else if (displayedTag.length > 0 && type == "chat") {
      let displayed = Strophe.getText(msg.getElementsByTagName("displayed")[0]);
      this.onMessageSeen = {
        senderJid: senderJid,
        displayed: displayed,
        groupJid: groupJid,
        messageId: messageId,
      };
      // console.log("displyed msg", this.onMessageSeen);
      this.typingObject.next(this.onMessageSeen);
    }
    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
  }

  /*Function
      List all chat room available on a server.
      Parameters:
      (String) server - name of chat server.
      (String) handle_cb - Function to call for room list return.
      (String) error_cb - Function to call on error.
      */

  listRooms(handle_cb, error_cb) {
    let iq = $iq({
      to: this.CONFERENCE_SERVICE,
      from: this.connection.jid,
      type: "get",
    }).c("query", {
      xmlns: Strophe.NS.DISCO_ITEMS,
    });
    return this.connection.sendIQ(iq, handle_cb, error_cb);
  }

  test_append_nick(room, nick) {
    var domain, node;
    node = Strophe.escapeNode(Strophe.getNodeFromJid(room));
    domain = Strophe.getDomainFromJid(room);
    return node + "@" + domain + (nick != null ? "/" + nick : "");
  }

  /*Function
    Join a multi-user chat room
    Parameters:
    (String) room - The multi-user chat room to join.
    (String) nick - The nickname to use in the chat room. Optional
    (Function) msg_handler_cb - The function call to handle messages from the
    specified chat room.
    (Function) pres_handler_cb - The function call back to handle presence
    in the chat room.
    (Function) roster_cb - The function call to handle roster info in the chat room
    (String) password - The optional password to use. (password protected
    rooms only)
    (Object) history_attrs - Optional attributes for retrieving history
    (XML DOM Element) extended_presence - Optional XML for extending presence
     */
  /* 
    room is the jid of the room and nick is your nickname. 
    You will need to write callback functions for handling the messages, rosters and presences (msg_handler_cb, pres_handler_cb,roster_cb). 
    Password can be null if one is not required. 
    Your history attributes define things line maxstanzas, 
    which define how far back to get messages when loading.
    */
  join(
    room,
    msg_handler_cb,
    pres_handler_cb,
    roster_cb,
    password,
    history_attrs,
    extended_presence
  ) {
    let nick = this.getNick();
    var msg, room_nick;
    room_nick = this.test_append_nick(room, nick);
    msg = $pres({
      from: this.connection.jid,
      to: room_nick,
    }).c("x", {
      xmlns: Strophe.NS.MUC,
    });
    if (history_attrs != null) {
      msg = msg.c("history", history_attrs).up();
    }
    if (password != null) {
      msg.cnode(Strophe.xmlElement("password", [], password));
    }
    if (extended_presence != null) {
      msg.up().cnode(extended_presence);
    }
    if (this._muc_handler == null) {
      this._muc_handler = this.connection.addHandler(
        (function (_this) {
          return function (stanza) {
            var from, handler, handlers, i, id, len, roomname, x, xmlns, xquery;
            from = stanza.getAttribute("from");
            if (!from) {
              return true;
            }
            roomname = from.split("/")[0];
            if (!_this.rooms[roomname]) {
              return true;
            }
            room = _this.rooms[roomname];
            handlers = {};
            if (stanza.nodeName === "message") {
              handlers = room._message_handlers;
            } else if (stanza.nodeName === "presence") {
              xquery = stanza.getElementsByTagName("x");
              if (xquery.length > 0) {
                for (i = 0, len = xquery.length; i < len; i++) {
                  x = xquery[i];
                  xmlns = x.getAttribute("xmlns");
                  if (xmlns && xmlns.match(Strophe.NS.MUC)) {
                    handlers = room._presence_handlers;
                    break;
                  }
                }
              }
            }
            for (id in handlers) {
              handler = handlers[id];
              if (!handler(stanza, room)) {
                delete handlers[id];
              }
            }
            return true;
          };
        })(this)
      );
    }

    if (!this.rooms.hasOwnProperty(room)) {
      this.rooms[room] = new XmppRoom(this, room, nick, password);
      if (pres_handler_cb) {
        this.rooms[room].addHandler("presence", pres_handler_cb);
      }
      if (msg_handler_cb) {
        this.rooms[room].addHandler("message", msg_handler_cb);
      }
      if (roster_cb) {
        this.rooms[room].addHandler("roster", roster_cb);
      }
      this.roomNames.push(room);
    }
    // get all the message
    // console.log("room", room);
    // let iqSend = $iq({
    //   type: "set",
    //   id: this.connection.getUniqueId(),
    //   to: room,
    // })
    //   .c("query", {
    //     xmlns: "urn:xmpp:mam:2",
    //   })
    //   .c("x", {
    //     xmlns: "jabber:x:data",
    //     type: "submit",
    //   })
    //   .c("field", {
    //     var: "FORM_TYPE",
    //     type: "hidden",
    //   })
    //   .c("value", {}, "urn:xmpp:mam:2");
    // .up()
    // .c("field", {
    //   var : 'start',
    // })
    // .c("value", {},  "2022-07-18T08:29:11.395Z")
    // .up().up()
    // .c("set", {
    //   xmlns : 'http://jabber.org/protocol/rsm',
    // })
    // .c("max", {}, "10")
    // .c("after", {}, "5e679205-a85b-41e9-9514-202eff1c9fb9")
    // this.connection.sendIQ(iqSend.tree(), this.onRoster);
    // console.log("iq", iqSend.tree());
    if (this.connection.connected) return this.connection.send(msg);
    return false;
  }

  /*Function
    Leave a multi-user chat room
    Parameters:
    (String) room - The multi-user chat room to leave.
    (String) nick - The nick name used in the room.
    (Function) handler_cb - Optional function to handle the successful leave.
    (String) exit_msg - optional exit message.
    Returns:
    iqid - The unique id for the room leave.
     */
  leave(room, handler_cb, exit_msg) {
    let nick = this.getNick();

    var id, presence, presenceid, room_nick;
    id = this.roomNames.indexOf(room);
    delete this.rooms[room];
    if (id >= 0) {
      this.roomNames.splice(id, 1);
      if (this.roomNames.length === 0) {
        this.connection.deleteHandler(this._muc_handler);
        this._muc_handler = null;
      }
    }
    room_nick = this.test_append_nick(room, nick);
    presenceid = this.connection.getUniqueId();
    presence = $pres({
      type: "unavailable",
      id: presenceid,
      from: this.connection.jid,
      to: room_nick,
    });
    if (exit_msg != null) {
      presence.c("status", exit_msg);
    }
    if (handler_cb != null) {
      this.connection.addHandler(
        handler_cb,
        null,
        "presence",
        null,
        presenceid
      );
    }
    this.connection.send(presence);
    return presenceid;
  }

  /*Function
    Parameters:
    (String) room - The multi-user chat room name.
    (String) nick - The nick name used in the chat room.
    (String) message - The plaintext message to send to the room.
    (String) html_message - The message to send to the room with html markup.
    (String) type - "groupchat" for group chat messages o
                    "chat" for private chat messages
    Returns:
    msgiq - the unique id used to send the message
     */
  message(room, message, html_message, type, msgid) {
    let nick = this.getNick();
    var msg, parent, room_nick;
    room_nick = this.test_append_nick(room, nick);
    type = type || (nick != null ? "chat" : "groupchat");
    msgid = msgid || this.connection.getUniqueId();
    msg = $msg({
      to: room_nick,
      from: this.connection.jid,
      type: type,
      id: msgid,
    })
      .c("body")
      .t(message);
    msg.up();
    if (html_message != null) {
      msg
        .c("html", {
          xmlns: Strophe.NS.XHTML_IM,
        })
        .c("body", {
          xmlns: Strophe.NS.XHTML,
        })
        .h(html_message);
      if (msg.node.childNodes.length === 0) {
        parent = msg.node.parentNode;
        msg.up().up();
        msg.node.removeChild(parent);
      } else {
        msg.up().up();
      }
    }
    msg
      .c("x", {
        xmlns: "jabber:x:event",
      })
      .c("composing");
    this.connection.send(msg);
    return msgid;
  }

  /*Function
    Convenience Function to send a Message to all Occupants
    Parameters:
    (String) room - The multi-user chat room name.
    (String) message - The plaintext message to send to the room.
    (String) html_message - The message to send to the room with html markup.
    (String) msgid - Optional unique ID which will be set as the 'id' attribute of the stanza
    Returns:
    msgiq - the unique id used to send the message
     */
  groupchat(room, message, html_message, msgid) {
    return this.message(room, message, html_message, void 0, msgid);
  }

  /**
    media sharing stanza
    @to  -> Group Jid,
    @mediaType ->  Media Type 2 = Iamge, 3 = Video, 4= Audio.
    @type -> Switch case value.
    */
  onMediaShareStanza(to, mediaData: MediaStanza) {
    this.getUserData();
    let reply: any;
    const msgId = this.connection.getUniqueId();
    const unixTimestap = this.unixTimestamp();
    reply = $msg({
      to,
      from: this.connection.jid,
      type: "groupchat",
      id: msgId,
    })
      .c("body", {})
      .t("Media Message");
    reply
      .up()
      .c("data", { xmlns: "data:jabber" })
      .c("messageId", {}, msgId)
      .c("to", {}, to)
      .c("groupId", {}, mediaData.groupId)
      .c("groupJid", {}, to)
      .c("groupImageUrl", {}, mediaData.groupImageUrl || "")
      .c("timestamp", {}, this.timeStamp())
      .c("unixtimestamp", {}, unixTimestap)
      .c("mediaType", {}, mediaData.mediaType)
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderImageUrl", {}, this.currentUserData.sender_image)
      .c("senderJid", {}, this.currentUserData.sender_jid)
      .c("senderId", {}, this.currentUserData.sender_id);
    let replyToAdmin;
    replyToAdmin = $msg({
      to: environment.adminJid,
      from: this.connection.jid,
      type: "chat",
      id: msgId,
    })
      .c("body", {})
      .t("Media Message");
    replyToAdmin
      .up()
      .c("data", { xmlns: "data:jabber" })
      .c("messageId", {}, msgId)
      .c("to", {}, to)
      .c("groupId", {}, mediaData.groupId)
      .c("groupJid", {}, to)
      .c("groupImageUrl", {}, mediaData.groupImageUrl || "")
      .c("timestamp", {}, this.timeStamp())
      .c("unixtimestamp", {}, unixTimestap)
      .c("mediaType", {}, mediaData.mediaType)
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderImageUrl", {}, this.currentUserData.sender_image)
      .c("senderJid", {}, this.currentUserData.sender_jid)
      .c("senderId", {}, this.currentUserData.sender_id);
    switch (mediaData.types) {
      case "image":
        reply
          .up()
          .c("mediaData", { xmlns: "mediadata:jabber" })
          .c("mediaUrl", {}, mediaData.mediaUrl)
          .c("mediaSize", {}, mediaData.mediaSize)
          .c("mediaThumbImageUrl", {}, mediaData.medidaThumbUrl)
          .c("mediaDuration", {}, "0.0");
        // for admin
        replyToAdmin
          .up()
          .c("mediaData", { xmlns: "mediadata:jabber" })
          .c("mediaUrl", {}, mediaData.mediaUrl)
          .c("mediaSize", {}, mediaData.mediaSize)
          .c("mediaThumbImageUrl", {}, mediaData.medidaThumbUrl)
          .c("mediaDuration", {}, "0.0");
        break;

      case "video":
        reply
          .up()
          .c("mediaData", { xmlns: "mediadata:jabber" })
          .c("mediaUrl", {}, mediaData.mediaUrl)
          .c("mediaSize", {}, mediaData.mediaSize)
          .c("mediaThumbImageUrl", {}, mediaData.medidaThumbUrl)
          .c("mediaDuration", {}, mediaData.mediaDuration);
        // for admin
        replyToAdmin
          .up()
          .c("mediaData", { xmlns: "mediadata:jabber" })
          .c("mediaUrl", {}, mediaData.mediaUrl)
          .c("mediaSize", {}, mediaData.mediaSize)
          .c("mediaThumbImageUrl", {}, mediaData.medidaThumbUrl)
          .c("mediaDuration", {}, mediaData.mediaDuration);
        break;

      case "audio":
        reply
          .up()
          .c("mediaData", { xmlns: "mediadata:jabber" })
          .c("mediaUrl", {}, mediaData.mediaUrl)
          .c("mediaSize", {}, mediaData.mediaSize)
          .c("mediaDuration", {}, mediaData.mediaDuration);
        // for admin
        replyToAdmin
          .up()
          .c("mediaData", { xmlns: "mediadata:jabber" })
          .c("mediaUrl", {}, mediaData.mediaUrl)
          .c("mediaSize", {}, mediaData.mediaSize)
          .c("mediaDuration", {}, mediaData.mediaDuration);
      default:
        break;
    }
    this.connection.send(reply.tree());
    this.connection.send(replyToAdmin.tree());
    // console.info("I sent ", to, ": ", reply.tree());
  }

  // Document Share stanza
  onDocumentShare(IdocumentData: Idocument) {
    this.getUserData();
    let reply: any;
    const msgId = this.connection.getUniqueId();
    const unixTimestap = this.unixTimestamp();
    reply = $msg({
      to: IdocumentData.toGroup,
      from: this.connection.jid,
      type: "groupchat",
      id: msgId,
    })
      .c("body", {})
      .t("Document Message");
    reply
      .up()
      .c("data", { xmlns: "data:jabber", xml: "lang=en-US" })
      .c("messageId", {}, msgId)
      .c("to", {}, IdocumentData.groupName)
      .c("groupId", {}, IdocumentData.groupId)
      .c("groupJid", {}, IdocumentData.toGroup)
      .c("groupImageUrl", {}, IdocumentData.groupImageUrl || "")
      .c("timestamp", {}, this.timeStamp())
      .c("unixtimestamp", {}, unixTimestap)
      .c("mediaType", {}, IdocumentData.mediaType)
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderImageUrl", {}, this.currentUserData.sender_image)
      .c("senderJid", {}, this.currentUserData.sender_jid)
      .c("senderId", {}, this.currentUserData.sender_id);
    reply
      .up()
      .c("docData", { xmlns: "docData:jabber" })
      .c("docUrl", {}, IdocumentData.docUrl)
      .c("docSize", {}, IdocumentData.docSize)
      .c("docType", {}, IdocumentData.docType);

    // for admin
    let replyToAdmin;
    replyToAdmin = $msg({
      to: environment.adminJid,
      from: this.connection.jid,
      type: "chat",
      id: msgId,
    })
      .c("body", {})
      .t("Document Message");
    replyToAdmin
      .up()
      .c("data", { xmlns: "data:jabber", xml: "lang=en-US" })
      .c("messageId", {}, msgId)
      .c("to", {}, IdocumentData.groupName)
      .c("groupId", {}, IdocumentData.groupId)
      .c("groupJid", {}, IdocumentData.toGroup)
      .c("groupImageUrl", {}, IdocumentData.groupImageUrl || "")
      .c("timestamp", {}, this.timeStamp())
      .c("unixtimestamp", {}, unixTimestap)
      .c("mediaType", {}, IdocumentData.mediaType)
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderImageUrl", {}, this.currentUserData.sender_image)
      .c("senderJid", {}, this.currentUserData.sender_jid)
      .c("senderId", {}, this.currentUserData.sender_id);
    replyToAdmin
      .up()
      .c("docData", { xmlns: "docData:jabber" })
      .c("docUrl", {}, IdocumentData.docUrl)
      .c("docSize", {}, IdocumentData.docSize)
      .c("docType", {}, IdocumentData.docType);
    this.connection.send(reply.tree());
    this.connection.send(replyToAdmin.tree());
    // console.info("I sent ", IdocumentData.toGroup, ": ", reply.tree());
  }

  /* 
    typying stanza
    */
  onTypingStanza(to) {
    this.getUserData();
    let reply;
    const msgId = this.connection.getUniqueId();
    reply = $msg({
      to,
      from: this.connection.jid,
      type: "groupchat",
      id: msgId,
    })
      .c("data", { xmlns: "data:jabber", "xml:lang": "en" })
      .c("groupJid", {}, to)
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderJid", {}, this.currentUserData.sender_jid);
    reply
      .up()
      .c("composing", { xmlns: "http://jabber.org/protocol/chatstates" });
    this.connection.send(reply.tree());
    // console.info('I sent ', to, ': ', reply.tree());
  }

  // Join all the room when user logged in
  // In which user is added!
  onRoomJoin() {
    // console.log("conceted",Strophe.Status.CONNECTED);
    let usersGroupList = [];
    this.chatsSvc.onGroupListChange.subscribe((res) => {
      usersGroupList = res.data.groupList;
      usersGroupList.forEach((ele) => {
        if (ele.room_jid != null && ele.room_jid != "") {
          // console.log("jid", ele.room_jid);

          this.join(
            ele.room_jid,
            true,
            true,
            true,
            null,
            { maxstanzas: 100000, seconds: 3600000 },
            null
          );
        }
      });
    });
  }

  // on group data refresh  stanza
  onGroupUpdate(onGroupData: onGroupUpdateSend) {
    let reply;
    const msgId = this.connection?.getUniqueId();
    reply = $msg({
      to: onGroupData.toMemberJid,
      type: "chat",
      id: msgId,
    })
      .c("data", { xmlns: "data:jabber" })
      .c("groupId", {}, onGroupData.groupId)
      .c("groupJid", {}, onGroupData.toGroupJid)
      .c("groupdatarefreshtrigger", {}, "groupdatarefreshtrigger");
    this.connection?.send(reply.tree());
    // console.info("I sent ", onGroupData.toGroupJid, ": ", reply.tree());
  }

  // on event message send
  onEventMessageStanza(IeventMessage: IEventMessage) {
    this.getUserData();
    let reply: any;
    const msgId = this.connection.getUniqueId();
    const unixTimestap = this.unixTimestamp();
    reply = $msg({
      to: IeventMessage.toGroup,
      from: this.connection.jid,
      type: "groupchat",
      id: msgId,
    })
      .c("body", {})
      .t(IeventMessage.message);
    reply
      .up()
      .c("data", { xmlns: "data:jabber", xml: "lang=en-US" })
      .c("messageId", {}, msgId)
      .c("to", {}, IeventMessage.groupName)
      .c("groupId", {}, IeventMessage.groupId)
      .c("groupJid", {}, IeventMessage.toGroup)
      .c("groupImageUrl", {}, IeventMessage.groupImageUrl || "")
      .c("timestamp", {}, this.timeStamp())
      .c("unixtimestamp", {}, unixTimestap)
      .c("mediaType", {}, "8")
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderImageUrl", {}, this.currentUserData.sender_image)
      .c("senderJid", {}, this.currentUserData.sender_jid)
      .c("senderId", {}, this.currentUserData.sender_id);
    reply
      .up()
      .c("eventData", { xmlns: "eventData:jabber" })
      .c("eventType", {}, IeventMessage.eventType);
      this.connection.send(reply.tree());
    // for admin notification
    // let replyToAdmin;
    // replyToAdmin = $msg({
    //   to: environment.adminJid,
    //   from: this.connection.jid,
    //   type: "chat",
    //   id: msgId,
    // })
    //   .c("body", {})
    //   .t(IeventMessage.message);
    // replyToAdmin
    //   .up()
    //   .c("data", { xmlns: "data:jabber", xml: "lang=en-US" })
    //   .c("messageId", {}, msgId)
    //   .c("to", {}, IeventMessage.groupName)
    //   .c("groupId", {}, IeventMessage.groupId)
    //   .c("groupJid", {}, IeventMessage.toGroup)
    //   .c("groupImageUrl", {}, IeventMessage.groupImageUrl || "")
    //   .c("timestamp", {}, this.timeStamp())
    //   .c("unixtimestamp", {}, unixTimestap)
    //   .c("mediaType", {}, "8")
    //   .c("senderName", {}, this.currentUserData.name)
    //   .c("senderFirstName", {}, this.currentUserData.first_name)
    //   .c("senderLastName", {}, this.currentUserData.last_name)
    //   .c("senderImageUrl", {}, this.currentUserData.sender_image)
    //   .c("senderJid", {}, this.currentUserData.sender_jid)
    //   .c("senderId", {}, this.currentUserData.sender_id);
    // replyToAdmin
    //   .up()
    //   .c("eventData", { xmlns: "eventData:jabber" })
    //   .c("eventType", {}, IeventMessage.eventType);
   
    // this.connection.send(replyToAdmin.tree());
    // console.info("I sent ", IeventMessage.toGroup, ": ", reply.tree());
  }

  // send message delivered ack. to sender message
  sendDeliveredMsgAck(sendAck: sendDeliveredORDisplayedAck) {
    let reply;
    const msgId = this.connection.getUniqueId();
    reply = $msg({
      to: sendAck.senderJid,
      from: this.connection.jid,
      type: "chat",
      id: msgId,
    })
      .c("data", { xmlns: "data:jabber" })
      .c("messageId", {}, sendAck.messageId) // send the message id which received in message
      .c("senderJid", {}, sendAck.senderJid)
      .c("groupJid", {}, sendAck.groupJid)
      .c("delivered", {}, this.timeStamp());
    this.connection.send(reply.tree());
  }

  // send message displayed ack. to sender message
  sendDisplayedMsgAck(sendAck: sendDeliveredORDisplayedAck) {
    let reply;
    const msgId = this.connection.getUniqueId();
    reply = $msg({
      to: sendAck.senderJid,
      from: this.connection.jid,
      type: "chat",
      id: msgId,
    })
      .c("data", { xmlns: "data:jabber" })
      .c("messageId", {}, sendAck.messageId) // send the message id which received in message
      .c("senderJid", {}, sendAck.senderJid)
      .c("groupJid", {}, sendAck.groupJid)
      .c("displayed", {}, this.timeStamp());
    this.connection.send(reply.tree());
  }

  // send qouted  text message
  sendQuotedMessage(quotedMessageData: sendQuotedMessage, type = "groupchat") {
    this.getUserData();
    let reply;
    const msgId = this.connection.getUniqueId();
    const unixTimestap = this.unixTimestamp();
    if (type == "groupchat") {
      reply = $msg({
        to: quotedMessageData.toGroup,
        from: this.connection.jid,
        type,
        id: msgId,
      })
        .c("body", {})
        .t(quotedMessageData.message);
      reply
        .up()
        .c("data", { xmlns: "data:jabber" })
        .c("messageId", {}, msgId)
        .c("to", {}, quotedMessageData.groupName)
        .c("groupId", {}, quotedMessageData.groupId)
        .c("groupJid", {}, quotedMessageData.toGroup)
        .c("groupImageUrl", {}, quotedMessageData.groupImageUrl || "")
        .c("timestamp", {}, this.timeStamp())
        .c("unixtimestamp", {}, unixTimestap)
        .c("mediaType", {}, "1")
        // .c("messageType", {}, "1")
        .c("senderName", {}, this.currentUserData.name)
        .c("senderFirstName", {}, this.currentUserData.first_name)
        .c("senderLastName", {}, this.currentUserData.last_name)
        .c("senderImageUrl", {}, this.currentUserData.sender_image)
        .c("senderJid", {}, this.currentUserData.sender_jid)
        .c("senderId", {}, this.currentUserData.sender_id)
        .up()
        .c("replyMessage", { xmlns: "replyMessage:jabber" })
        .c("replyMessageId", {}, quotedMessageData.quotedmessageId)
        .c("replyMediaType", {}, quotedMessageData.quotedmessageType)
        .c("replySenderName", {}, quotedMessageData.quotedsenderName)
        .c("replySenderFirstName", {}, quotedMessageData.quotedsenderfirstname)
        .c("replySenderLastName", {}, quotedMessageData.quotedsenderlastname)
        .c("replySenderImageUrl", {}, quotedMessageData.quotedsendImage || "")
        .c("replySenderJid", {}, quotedMessageData.quotedsendJid)
        .c("replySenderId", {}, quotedMessageData.quotedsenderId)
        .c("replyBody", {}, quotedMessageData.quotedmessage);
    }

    let replyToAdmin;
    replyToAdmin = $msg({
      to: environment.adminJid,
      from: this.connection.jid,
      type: "chat",
      id: msgId,
    })
      .c("body", {})
      .t(quotedMessageData.message);
    replyToAdmin
      .up()
      .c("data", { xmlns: "data:jabber" })
      .c("messageId", {}, msgId)
      .c("to", {}, quotedMessageData.groupName)
      .c("groupId", {}, quotedMessageData.groupId)
      .c("groupJid", {}, quotedMessageData.toGroup)
      .c("groupImageUrl", {}, quotedMessageData.groupImageUrl || "")
      .c("timestamp", {}, this.timeStamp())
      .c("unixtimestamp", {}, unixTimestap)
      .c("mediaType", {}, "9")
      .c("messageType", {}, "1")
      .c("senderName", {}, this.currentUserData.name)
      .c("senderFirstName", {}, this.currentUserData.first_name)
      .c("senderLastName", {}, this.currentUserData.last_name)
      .c("senderImageUrl", {}, this.currentUserData.sender_image)
      .c("senderJid", {}, this.currentUserData.sender_jid)
      .c("senderId", {}, this.currentUserData.sender_id)
      .up()
      .c("replyMessage", { xmlns: "replyMessage:jabber" })
      .c("replyMessageId", {}, quotedMessageData.quotedmessageId)
      .c("replyMediaType", {}, quotedMessageData.quotedmessageType)
      .c("replySenderName", {}, quotedMessageData.quotedsenderName)
      .c("replySenderFirstName", {}, quotedMessageData.quotedsenderfirstname)
      .c("replySenderLastName", {}, quotedMessageData.quotedsenderlastname)
      .c("replySenderImageUrl", {}, quotedMessageData.quotedsendImage || "")
      .c("replySenderJid", {}, quotedMessageData.quotedsendJid)
      .c("replySenderId", {}, quotedMessageData.quotedsenderId)
      .c("replyBody", {}, quotedMessageData.quotedmessage);

    this.connection.send(reply.tree());
    // this.connection.send(replyToAdmin.tree());
    console.info("I sent ", reply.tree());
    // console.info(
    //   "I sent ",
    //   textMessage.toGroup,
    //   ": " + textMessage.message,
    //   replyToAdmin.tree()
    // );
  }


  // send message unread count stanza to admin
  sendLastMessageData(sendMsgD: sendMsgData) {
    let reply;
    const msgId = this.connection.getUniqueId();
    reply = $msg({
      to: environment.adminJid,
      from: this.connection.jid,
      type: "chat",
      id: msgId,
    })
      .c("data", { xmlns: "data:jabber" })
      .c("messageId", {}, sendMsgD.messageId)
      .c("senderJid", {}, sendMsgD.senderJid)
      .c("groupJid", {}, sendMsgD.groupJid)
      .c("groupId", {}, sendMsgD.groupId)
      .c("timestamp", {}, sendMsgD.timestamp)
      .c("messageType", {}, "unread_count");
    this.connection.send(reply.tree());
  }

  // get unread count for group
  /**
   * 
   * @param roomJid
   * @param timeStamp
   */
  getUnreadCount(data: unreadMessageData) {
    let unreadIqSend = $iq({
      type: "set",
      id: this.connection.getUniqueId(),
      to: data.roomJid,
    })
      .c("query", {
        xmlns: "urn:xmpp:mam:2",
      })
      .c("x", {
        xmlns: "jabber:x:data",
        type: "submit",
      })
      .c("field", {
        var: "FORM_TYPE",
        type: "hidden",
      })
      .c("value", {}, "urn:xmpp:mam:2")
      .up()
      .c("field", {
        var: "start",
      })
      .c("value", {}, data.timeStamp)
      .up()
      .up()
      .c("set", {
        xmlns: "http://jabber.org/protocol/rsm",
      })
      .c("max", {}, "0");
    this.connection.sendIQ(unreadIqSend, this.onUnreadIQReceive, this.error_cb);
    // console.log("iq", unreadIqSend);
  }

  // unread count IQ error
  error_cb = (mes) => {
    // console.log("mesd", mes);
  };

  // unread count IQ.
  onUnreadIQReceive = (data) => {
    console.log("unread", data);
    let setEleTag = data.getElementsByTagName("set")[0];
    let errorEleTag = data.getElementsByTagName("error")[0];
    if (setEleTag && !errorEleTag) {
      let count = Strophe.getText(data.getElementsByTagName("count")[0]);
      let fromRoomJid = data.getAttribute("from");
      console.log(+count, fromRoomJid);
    } else {
      console.log("error", errorEleTag);
    }
  };

  //get message histroy from paticular date
  getMessageHistory(data: unreadMessageData) {
    let unreadIqSend = $iq({
      type: "set",
      id: this.connection.getUniqueId(),
      to: data.roomJid,
    })
      .c("query", {
        xmlns: "urn:xmpp:mam:2",
      })
      .c("x", {
        xmlns: "jabber:x:data",
        type: "submit",
      })
      .c("field", {
        var: "FORM_TYPE",
        type: "hidden",
      })
      .c("value", {}, "urn:xmpp:mam:2")
      .up()
      .c("field", {
        var: "start",
      })
      .c("value", {}, data.timeStamp)
    this.connection.sendIQ(unreadIqSend);
  }
}
