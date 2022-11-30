import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { ToastrService } from "ngx-toastr";
import { XMPPService } from "../../../ejab.service";
import { ChatsService } from "../../chats.service";
import { MediaStanza } from "../../media-share-stanza";
import { MinMaxDirective } from "min-max-popup";
import {
  Idocument,
  IEventMessage,
  sendMessage,
  sendQuotedMessage,
} from "../../send-message";
import { AudioRecordingService } from "../../utils/audio.service";
import { fileFormat } from "../../utils/file-format";
import { Subscription } from "rxjs";
import { locale as english } from "../../i18n/en";
import { locale as arabic } from "../../i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
import imageCompression from "browser-image-compression";
import { imageCompressConfig } from "./image-compressor-config";
import { AnimatedCustomContextMenuComponent } from "./custom-context-menu/custom-context-menu.component";
import { GroupManagementService } from "app/main/pages/group-management/group-management.service";
import { EventTypes } from "../../utils/event-type-enums";
import { onGroupUpdateSend } from "../../utils/group-update";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeviceManagementService } from "app/main/pages/device-management/device-management.service";
import { VideoPlaylistService } from "app/main/pages/device-management/video-player/video-playlist.service";
import { FirebaseMessageService } from "../../../services/firebase-message.service";
import { Router } from "@angular/router";
import { VideoWraperComponent } from "app/main/pages/device-management/video-player/video-wraper/video-wraper.component";
import { pinDropVar } from "../../../map/pin-drop-interface";
import { colors } from "./colors";
import { ConferenceCallComponent } from "../../../../../../shared/conference-call/conference-call.component";
import { ConferenceCallModalComponent } from "../../../../../../shared/conference-call-modal/conference-call-modal.component";
import { SecurePipe } from "@core/pipes/imageauthorisation.pipe";
const FileSaver = require("file-saver");
@Component({
  selector: "app-chat-active-sidebar",
  templateUrl: "./chat-active-sidebar.component.html",
  styleUrls: ["./chat-active.scss"],
})
export class ChatActiveSidebarComponent implements OnInit {
  public animatedContextMenu = AnimatedCustomContextMenuComponent;
  // Public
  obs: Subscription;
  public chatUser;
  public chatMessage = "";
  currentLoggedInUser;
  // selectedGroup;
  public selectedFile: File = null;
  public thumbnail = null;
  public imageThubnail = null;
  public mediaData: MediaStanza;
  public fileSize: number = 0;
  public audioDuration: number = 0.0;
  public videoDuration: number = 0.0;
  Messages = [];
  allMessages = [];
  leftSideMessages = [];
  rightSideMessages = [];
  newData = [];
  todaysDate;
  public showPortal = false;
  colorCodes = colors;
  public typing: boolean = true;
  @ViewChild("scrollMe", { static: false })
  private myScrollContainer: ElementRef;
  @ViewChild("inputFile") myInputVariable: ElementRef;
  public mediaFormats: string = fileFormat;
  // Decorator
  scrolltop: number = null;
  @Input("selectedChat") selectedGroup: any;
  public textMessage: sendMessage;
  public sendQuotedMessage: sendQuotedMessage;
  public qoutMessageData;
  public isQoutedMessage: boolean = false;
  public replyDiv: boolean = false;
  public IDocmentData: Idocument;
  @ViewChild("textInput") private textInput: ElementRef;
  //audio recording
  public isAudioRecording = false;
  public audioRecordedTime;
  public audioBlobUrl;
  public audioBlob;
  public audioName;
  public audioConf = { audio: true };
  public isAudioStarted: boolean = false;
  public heightpage;
  public alert_color = 0;
  public clickedMessageData: any;
  /* modal code*/
  public selectedAlert;
  public alertLevels = [
    { id: 1, name: "Grey" },
    { id: 2, name: "Orange" },
    { id: 3, name: "Red" },
    // { id: 4, name: "Green" },
  ];
  public eventMessage: IEventMessage;
  public onGroupUpdate: onGroupUpdateSend;
  public selectedGroupMemersData = [];
  @ViewChild("modalConfirm") confrimModal;
  public isIPStreamModal: boolean = false;
  public isViewStreamModal: boolean = false;
  public isAudioCallModal: boolean = false;
  public isImageView:boolean=false;
  public ipStreamData: any = null;
  public viewStreamData: any = null;
  @ViewChild("conferenceCallModal") conferenceCallModal;
  @ViewChild("imageView") ViewImgModal; 
  currentImage: any;
  public el: boolean =false;
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private xamppSvc: XMPPService,
    private chatsSvc: ChatsService,
    private _toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    private _coreTranslationService: CoreTranslationService,
    private groupMgtSvc: GroupManagementService,
    private minmaxservice: MinMaxDirective,
    private modalService: NgbModal,
    private deviceManagementSvc: DeviceManagementService,
    private videoPlayList: VideoPlaylistService,
    private messagingService: FirebaseMessageService,
    private router: Router,
    private securePipe: SecurePipe
  ) {
    this._coreTranslationService.translate(english, arabic);
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
      this.ref.detectChanges();
    });
  }

  ngAfterViewChecked() {
    if (this.myScrollContainer.nativeElement.scrollHeight > this.heightpage) {
      this.scrollToBottom();
    }
    // if(this.selectedGroup?.alert_level){
    //   this.selectedAlert = this.alertLevels.filter((val) => {
    //     return this.selectedGroup.alert_level == this.alert_color;
    //   })[0]?.name;
    // }
  }

  // Scroll to bottom on message send
  scrollToBottom(): void {
    try {
      this.heightpage = this.myScrollContainer.nativeElement.scrollHeight;
      // console.log(this.heightpage, this.myScrollContainer.nativeElement.scrollHeight);
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  nameArray = [{ name: "", color: "" }];
  setColorCodes(index: any, name: any) {
    const indexing = this.nameArray.findIndex((x: any) => {
      return x.name == name;
    });

    if (indexing == -1) {
      let color = this.colorCodes[Math.floor(Math.random() * 100) % 50];
      this.nameArray.push({ name, color });
      return color;
    }

    return this.nameArray[indexing].color;
  }

  openPopup(state) {
    if (state) {
      this.showPortal == true;
    } else {
      this.showPortal == false;
    }
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this.xamppSvc.clickMapDiv.next(false);
    if (this._coreSidebarService.getSidebarRegistry(name)) {
      if (
        this._coreSidebarService.getSidebarRegistry(name)
          .isOpened == true
      ) {
        this._coreSidebarService.getSidebarRegistry(name).close();
      } else {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
      }
    } 
  }

  // Download Documents
  downloadPdf(url) {
    const pdfUrl = url;
    const pdfName = "document";
    FileSaver.saveAs(pdfUrl, pdfName);
  }

  /**
   * Update Chat
   */
  updateChat() {
    if (!this.chatMessage.replace(/\s/g, "").length) {
      // console.log("string only contains whitespace (ie. spaces, tabs or line breaks)");
      return;
    }

    if (this.chatMessage) {
      this.textMessage = {
        toGroup: this.selectedGroup.room_jid,
        message: this.chatMessage,
        groupId: this.selectedGroup.group_id,
        groupImageUrl: this.selectedGroup.image ? this.selectedGroup.image : "",
        groupName: this.selectedGroup.name,
      };
      if (!this.isQoutedMessage) {
        this.xamppSvc.sendMessage(this.textMessage);
        this.isQoutedMessage = false;
        this.chatMessage = "";
      }
      if (this.isQoutedMessage) {
        this.sendQuotedMessage = {
          toGroup: this.selectedGroup.room_jid,
          message: this.chatMessage,
          groupId: this.selectedGroup.group_id,
          groupImageUrl: this.selectedGroup.image
            ? this.selectedGroup.image
            : "",
          groupName: this.selectedGroup.name,
          quotedmessageId: this.qoutMessageData.messageId,
          quotedsenderName: this.qoutMessageData.senderName,
          quotedsendJid: this.qoutMessageData.sendJid,
          quotedsenderId: this.qoutMessageData.senderId,
          quotedsendImage: this.qoutMessageData.sendImage,
          quotedmessage: this.qoutMessageData.message,
          quotedmessageType: 1,
          quotedsenderfirstname: this.qoutMessageData.senderFirstName,
          quotedsenderlastname: this.qoutMessageData.senderLastName,
        };
        this.xamppSvc.sendQuotedMessage(this.sendQuotedMessage);
        this.isQoutedMessage = false;
        this.chatMessage = "";
        this.closeReplyMessage();
      }
    }
    setTimeout(() => {
      this.chatMessage = "";
    }, 100);
    this.scrollToBottom();
  }

  // on key down
  onKeyDown(event) {
    if (event.keyCode == 16 && event.keyCode == 13) {
      this.chatMessage = this.chatMessage + "\r\n";
    }
  }

  room_jid;
  group_id;
  joinRoom() {
    this.chatsSvc.membersData.subscribe((val) => {
      this.nameArray = [{ name: "", color: "" }];
      if (val.is_call_active == "true") {
        this.group_id = val.group_id;
        this.room_jid = val.room_jid;
        this.onRoomJoin();
      } else {
        this.group_id = val.group_id;
        this.room_jid = val.room_jid;
        this.onRoomJoin();
      }
    });
  }

  // on room join get all the message of that room
  onRoomJoin() {
    this.Messages = [];
    this.allMessages = [];
    this.leftSideMessages = [];
    this.rightSideMessages = [];
    this.newData = [];
    this.xamppSvc.join(
      this.room_jid,
      true,
      true,
      true,
      null,
      { maxstanzas: 100000, seconds: 3600000 },
      null
    );
  }

  messageData() {
    this.xamppSvc.messageObject.subscribe(async (data: any) => {
      if (data['medidaAudioUrl']) {
        data['medidaAudioUrl'] = this.sanitizer.bypassSecurityTrustUrl(
          await this.securePipe.transform(data['medidaAudioUrl'])
        );
      }

      if (data['mediaVideoUrl']) {
        data['mediaVideoUrl'] = this.sanitizer.bypassSecurityTrustUrl(
          await this.securePipe.transform(data['mediaVideoUrl'])
        );
      }

      if (data?.messageId) {
        this.typing = false;
        // this.timer = 0
        this.todaysDate = `${new Date().getDate()}-${
          new Date().getMonth() + 1
        }-${new Date().getFullYear()}`;
        let index = this.Messages.filter(
          (values) => values.messageId == data.messageId
        );

        if (index?.length == 0 && data.groupId == this.selectedGroup.group_id) {
          this.Messages.push(data);
          this.allMessages.push(data);
          this.xamppSvc.sendDisplayedMsgAck({
            groupJid: data.groupJid,
            senderJid: data.sendJid,
            messageId: data.messageId,
          });
          this.allMessages.sort(function (a, b) {
            return a.unixTimeStamp > b.unixTimeStamp
              ? 1
              : b.unixTimeStamp > a.unixTimeStamp
              ? -1
              : 0;
          });
          this.newData = [];
          let allDates = [];
          this.allMessages.map((val) => {
            if (!val.unixTimeStamp) val.unixTimeStamp = Date.now();
            let index = allDates.filter((data) => {
              return (
                data ==
                `${new Date(parseInt(val.unixTimeStamp)).getDate()}-${
                  new Date(parseInt(val.unixTimeStamp)).getMonth() + 1
                }-${new Date(parseInt(val.unixTimeStamp)).getFullYear()}`
              );
            });
            if (index.length == 0) {
              allDates.push(
                `${new Date(parseInt(val.unixTimeStamp)).getDate()}-${
                  new Date(parseInt(val.unixTimeStamp)).getMonth() + 1
                }-${new Date(parseInt(val.unixTimeStamp)).getFullYear()}`
              );
              this.newData.push(
                `${new Date(parseInt(val.unixTimeStamp)).getDate()}-${
                  new Date(parseInt(val.unixTimeStamp)).getMonth() + 1
                }-${new Date(parseInt(val.unixTimeStamp)).getFullYear()}`
              );
            }

            val.status = 0;
            this.newData.push(val);
            this.scrollToBottom();
          });
        }
      }
    });
  }

  typingName;
  timer = 5000;
  typingData() {
    this.xamppSvc.typingObject.subscribe((val) => {
      if (val?.isTypingStanza) {
        this.typingName = val.senderName ? val.senderName : "someone";
        if (
          this.currentLoggedInUser.jid !== val.senderJid &&
          this.selectedGroup.room_jid == val.groupJid
        )
          this.typing = true;

        setTimeout(() => {
          this.typing = false;
        }, 2000);
      } else this.typing = false;

      if (val?.displayed) {
        let index = this.newData.findIndex((data) => {
          return data.messageId == val.messageId;
        });

        if (index > -1) {
          this.newData[index].status = 2;
        }
      }

      if (val?.delivered) {
        this.typing = false;
        let index = this.newData.findIndex((data) => {
          return data.messageId == val.messageId;
        });

        if (index > -1) {
          this.newData[index].status = 1;
        }
      }
    });
  }

  getTicks(id) {
    if (id == 0) {
      return "../../../../../../../assets/images/Shape (1).svg";
    } else if (id == 1) {
      return "../../../../../../../assets/images/Shape.svg";
    } else if (id == 2) {
      return "../../../../../../../assets/images/Group 11286.svg";
    } else return null;
  }

  divScroll() {
    this.xamppSvc.clickGroupChat.subscribe((val) => {
      this.scrollToBottom();
      if (val == "clicked") {
        // var objDiv = document.getElementById("messages");
        // objDiv.scrollTop = objDiv.scrollHeight;
      }
    });
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // console.log(this.selectedGroup, "group");
    this.scrollToBottom();
    this.currentLoggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    this.joinRoom();
    this.onRoomJoin();
    this.messageData();
    this.typingData();
    this.scrollToBottom();
    this.checkRoute();
    this._coreSidebarService.getSidebarRegistry("chat-active-sidebar").open()
    this.bothSideBarOpen("chat-active-sidebar");
    // this.chatsSvc.openSidebarEvent.subscribe((res) => {
    //   console.log("ACTIVE")
    //   if (this._coreSidebarService.getSidebarRegistry("chat-active-sidebar"))
    //     this._coreSidebarService
    //       .getSidebarRegistry("chat-active-sidebar")
    //       .close();
    //   setTimeout(() => {
    //     this.toggleSidebar("chat-active-sidebar");
    //   }, 300);
    // });
    // this.chatsSvc.openSidebarEvent.emit(false);

    // on chat reply event received
    this.chatsSvc.onReplyClicked.subscribe((res) => {
      if (res) {
        this.onReplyClick();
      }
    });

    // On Group selected members data
    // this.chatsSvc.selectGroupMembers.subscribe((res:any) => {
    //   this.selectedGroupMemersData = res;
    // })

    // Live streaming notification.
    this.messagingService.liveStreaming.subscribe((data: any) => {
      if (this.selectedGroup && this.selectedGroup.room_jid == data.room_jid) {
        if (data.is_live_stream_active == "true")
          this.selectedGroup.is_live_stream_active = true;
        if (data.is_live_stream_active == "false")
          this.selectedGroup.is_live_stream_active = false;
      }
    });
  }

  bothSideBarOpen(name){
    this.chatsSvc.openSidebarEvent.subscribe((res) => {
      console.log(
        this._coreSidebarService.getSidebarRegistry(name).isOpened,
        "Service"
      );
      if (this._coreSidebarService.getSidebarRegistry(name))
        this._coreSidebarService
          .getSidebarRegistry(name)
          .close();
      setTimeout(() => {
        this.toggleSidebar(name);
      }, 300);
    });
  }

  // File upload which will handle all type of file
  handleFileUpload = async (e) => {
    if (e.target.files[0].size / 1024 / 1024 < 50) {
      this.selectedFile = <File>e.target.files[0];
      this.fileSize = e.target.files[0].size;
      if (this.selectedFile.type.includes("image")) {
        await this.handleImageThumbnailGen(e.target.files[0]).then(
          (imageThumnail) => {
            if (imageThumnail) {
              this.imageThubnail = imageThumnail;
              this.uploadMedia("2");
            } else return "error ";
          }
        );
      } else if (this.selectedFile.type.includes("video")) {
        await this.generateVideoThumbnail(e.target.files[0])
          .then((thumbnail) => {
            if (thumbnail) {
              this.thumbnail = thumbnail;
              this.uploadMedia("3");
            } else return "error ";
          })
          .catch((err) => {
            return err;
          });
      } else if (this.selectedFile.type.includes("audio")) {
        this.audiooLength(this.selectedFile)
          .then((duration: number) => {
            if (duration) {
              this.audioDuration = duration;
              this.uploadMedia("4");
            }
          })
          .catch((err) => {
            return err;
          });
      } else if (
        this.selectedFile.type.includes("application") ||
        this.selectedFile.type.includes("text/plain")
      ) {
        this.onDocumentShare();
      }
    } else {
      this.reset();
      this._toastrService.error("File size is limited to 50MB", "Error!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
    }
  };

  // Image Thumbnail Generater
  handleImageThumbnailGen(event) {
    return new Promise((resolve, reject) => {
      var options = imageCompressConfig;
      imageCompression(event, options)
        .then(function (compressedFile) {
          resolve(compressedFile);
        })
        .catch(function (error) {
          reject(error);
          console.log(error.message);
        });
    });
  }

  // calculate the Duration of Audio File
  audiooLength(file) {
    return new Promise((resolve) => {
      var objectURL = URL.createObjectURL(file);
      // console.log("audio file", objectURL);
      var mySound = new Audio(objectURL);
      mySound.addEventListener(
        "canplaythrough",
        () => {
          URL.revokeObjectURL(objectURL);
          resolve(mySound.duration);
        },
        false
      );
    });
  }

  // Generate Thumbnail from video as image/jpge format
  generateVideoThumbnail = (file: File) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");
      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
      video.onloadeddata = () => {
        let duration = video.duration;
        this.videoDuration = duration;
        let ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        if (!video) {
          return reject("Video not supported");
        }
        canvas.toBlob(
          (blob) => {
            // console.log("blob", blob);
            resolve(blob);
            this.thumbnail = blob;
          },
          "image/jpeg",
          0.75 /* quality */
        );
      };
    });
  };

  // Resets the file input to null
  reset() {
    this.myInputVariable.nativeElement.value = "";
  }

  // Uploads the selected File to backend
  uploadMedia(mediaType) {
    const formData = new FormData();
    formData.append("group_id", this.selectedGroup.group_id);
    formData.append("attachment_file", this.selectedFile);
    if (mediaType == "2") {
      formData.append("attachment_file_thumb", this.imageThubnail, "image.jpg");
    } else if (mediaType == "3") {
      formData.append("attachment_file_thumb", this.thumbnail, "image.jpg");
      formData.append("duration", JSON.stringify(this.videoDuration));
    } else if (mediaType == "4") {
      formData.append("duration", JSON.stringify(this.audioDuration));
    }
    this.chatsSvc.uploadAttachment(formData).subscribe((res: any) => {
      // console.log("urls", res);
      this.mediaData = {
        mediaUrl: res.data.attachmentUrl,
        mediaSize: this.fileSize,
        mediaDuration: res.data.duration,
        medidaThumbUrl: res.data.attachmentThumbUrl,
        mediaType: mediaType,
        types: res.data.media_type,
        groupId:
          this.selectedGroup
            .group_id /*  bind dynamic value of selected group */,
        groupImageUrl: this.selectedGroup.image,
      };
      this.xamppSvc.messageObject.next(this.mediaData);
      this.xamppSvc.onMediaShareStanza(
        this.room_jid /*  bind dynamic value of selected group JID*/,
        this.mediaData
      );
      this.reset();
    });
  }

  // On Document share media
  onDocumentShare() {
    const formData = new FormData();
    formData.append("group_id", this.selectedGroup.group_id);
    formData.append("attachment_file", this.selectedFile);
    this.chatsSvc.uploadAttachment(formData).subscribe((res: any) => {
      this.IDocmentData = {
        toGroup: this.room_jid,
        groupId: this.selectedGroup.group_id,
        groupImageUrl: this.selectedGroup.image ? this.selectedGroup.image : "",
        groupName: this.selectedGroup.name,
        docUrl: res.data.attachmentUrl,
        docSize: this.selectedFile.size,
        docType: this.selectedFile.type,
        mediaType: "5",
      };
      this.xamppSvc.onDocumentShare(this.IDocmentData);
      this.reset();
    });
  }

  // audio recording
  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.isAudioStarted = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.isAudioStarted = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
      this.isAudioStarted = true;
    }
  }

  clearAudioRecordedData() {
    this.isAudioStarted = false;
    this.audioBlobUrl = null;
  }

  sendAudio() {
    this.chatMessage = "";
    // this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
    // this.isAudioStarted  = false;
    // this.isAudioRecording = false
    const formData = new FormData();
    formData.append("group_id", this.selectedGroup.group_id);
    formData.append("attachment_file", this.audioBlob, "audio.mp3");
    formData.append("duration", this.audioRecordedTime);
    this.chatsSvc.uploadAttachment(formData).subscribe((res: any) => {
      this.clearAudioRecordedData();
      this.mediaData = {
        mediaUrl: res.data.attachmentUrl,
        mediaSize: this.fileSize,
        mediaDuration: res.data.duration,
        medidaThumbUrl: res.data.attachmentUrl,
        mediaType: "4",
        types: res.data.media_type,
        groupId:
          this.selectedGroup
            .group_id /*  bind dynamic value of selected group */,
        groupImageUrl: this.selectedGroup.image,
      };
      this.xamppSvc.messageObject.next(this.mediaData);
      this.xamppSvc.onMediaShareStanza(
        this.room_jid /*  bind dynamic value of selected group JID*/,
        this.mediaData
      );
      // this.reset();
    });
  }
  // ngAfterViewInit() : void{
  //   if(this.selectedGroup?.alert_level){
  //     this.selectedAlert = this.alertLevels.filter((val) => {
  //       return this.selectedGroup.alert_level == this.alert_color;
  //     })[0]?.name;
  //   }
  // }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  keyup(event) {
    this.xamppSvc.onTypingStanza(this.selectedGroup.room_jid);
    // this.xamppSvc.groupchat()
  }

  // on message click get data
  onMessageClick(data) {
    this.clickedMessageData = data;
  }

  // on click of reply qoute message
  onReplyClick() {
    this.qoutMessageData = this.clickedMessageData;
    this.isQoutedMessage = true;
    this.replyDiv = true;
    this.textInput.nativeElement.focus();
  }

  closeReplyMessage() {
    this.replyDiv = false;
    this.qoutMessageData = null;
    this.isQoutedMessage = false;
  }

  // need to implement
  scrollToMessage(data) {
    this.Messages.forEach((ele) => {
      if (ele.messageType == "1" || ele.messageType == "9") {
        if (ele.messageId == data.quotedmessageId) {
          let d1 = document.getElementById(`messageId-${ele.messageId}`);
          if (d1) {
            d1.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
              d1.classList.add("message-highlight");
              setTimeout(() => {
                d1.classList.remove("message-highlight");
              }, 1200);
            }, 200);
          }
        }
      }
    });
  }

  // Get Alert Level Status
  getAlertLevelStatus(alert_level) {
    if (alert_level == 2) return `color : #fd7a40`;
    if (alert_level == 3) return `color : red`;
  }

  // Get Live Streaming Status
  getLiveStreamingStatus(streaming_status) {
    if (streaming_status) return `color : #28C76F`;
  }

  // Get Conference call status
  getConferenceStatus(Conference_status) {
    if (Conference_status) return `color : #28C76F`;
  }

  // Get IP stream Camera Status
  getIpCameraStatus(ip_camera_status) {
    if (ip_camera_status) return `color : #0000FF`;
  }

  // refresh group listing
  getAllGroups() {
    this.chatsSvc.getChatGroupList(this.currentLoggedInUser.id);
  }

  //Group alert update
  groupAlertUpdate(modal) {
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      size: "lg",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
    // setInterval(()=>{

      if (!this.alert_color) {
        // console.log("!this.alert_color: " , this.alert_color)
        this.selectedAlert = this.alertLevels.filter((val) => {
          return this.selectedGroup.alert_level == val.id;
        })[0].name;
      }
      else{
        this.selectedGroup.alert_level = this.alert_color;
        this.selectedAlert = this.alertLevels.filter((val) => {
          return this.selectedGroup.alert_level == val.id
        })[0].name;
        }
  }

  // Change alert level for group.
  submitAlert() {
    const data = this.alertLevels.filter((val) => {
      return this.selectedAlert == val.name;
    })[0]?.id;

    this.alert_color = data;
    let values = {
      alert_level: data,
    };
    this.groupMgtSvc
      .updateAlertLevelDetails(this.selectedGroup.group_id, values)
      .subscribe((val: any) => {
        if (val.success) {
          this.modalService.dismissAll();
          this._toastrService.success(val["message"], "Success!", {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
          this.getAllGroups();
          this.onGroupChangeData(
            val.data.groupDetails.id,
            val.data.groupDetails.room_jid
          );
          // on group alert level change
          if (val.data.alert_changed) {
            const colorText = this.alertLevels.filter((el) => {
              return el.id == val.data.groupDetails.alert_level;
            })[0].name;

            this.eventMessage = {
              toGroup: this.selectedGroup.room_jid,
              groupId: this.selectedGroup.group_id,
              groupName: this.selectedGroup.name,
              groupImageUrl: this.selectedGroup.image || "",
              message: `${this.currentLoggedInUser.name} changed group alert level to ${colorText}`,
              eventType: EventTypes.alertLevelUpdate,
            };
            setTimeout(() => {
              this.onGroupAlertLevelChange(this.eventMessage);
            }, 1000);
          }
        }
      });
  }

  // on group alert level change event
  onGroupAlertLevelChange(data: IEventMessage) {
    this.xamppSvc.onEventMessageStanza(data);
  }

  // on Real time group Update
  onGroupChangeData(id: number, group_jid: string) {
    this.chatsSvc.getChatGroupMmebersList(id).subscribe((res: any) => {
      res.data.groupDetails.members.forEach((element) => {
        this.onGroupUpdate = {
          toGroupJid: group_jid,
          groupId: id,
          toMemberJid: element.user.jid,
        };
        this.xamppSvc.onGroupUpdate(this.onGroupUpdate);
      });
    });
  }

  // On Modal Cancel.
  cancel() {
    this.modalService.dismissAll();
    this.isIPStreamModal = false;
    this.isViewStreamModal = false;
    this.isAudioCallModal = false;
    this.ipStreamData = null;
    this.viewStreamData = null;
  }

  getAllStreamingDeviceList() {
    let params = {
      pageNumber: this.page.offset,
      pageSize: this.page.limit,
      id: this.selectedGroup?.group_id,
    };
    this.chatsSvc
      .getAllStreamingDevicesDashboard(params)
      .subscribe((res: any) => {
        if (res) {
          this.ipStreamListData = res.data;
          this.current_page = res.current_page || 0;
          this.page.count = res.page_count || 0;
          this.fakeArray = new Array(res.page_count || 0);
        }
      });
  }

  // IP stream modal
  ipstreamModal(modal) {
    this.pageCallback({ offset: 1 });
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      scrollable: true,
      size: "lg",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
    this.isIPStreamModal = true;
  }
  public ipStreamListData: any[];
  pageIfx = 5;
  pageIfy = 0;
  page = {
    limit: 10,
    count: 0,
    offset: 1,
  };
  fakeArray = [];
  public current_page: any;
  public totalPages = [];

  pagination(page) {
    this.page.offset = page;
    this.getAllStreamingDeviceList();
  }

  pageNext() {
    if (this.page.count > 5 && this.page.count - this.current_page > 4) {
      this.pageIfy += 1;
      this.pageIfx += 1;
    }

    if (this.page.offset < this.page.count) {
      this.page.offset += 1;
      this.getAllStreamingDeviceList();
    }
  }

  pagePrev() {
    if (this.pageIfy > 0) {
      this.pageIfy -= 1;
      this.pageIfx -= 1;
    }

    if (this.page.offset > 1) {
      this.page.offset -= 1;
      this.getAllStreamingDeviceList();
    }
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.getAllStreamingDeviceList();
  }
  // View Stream modal
  viewstreamModal(modal) {
    if (this.selectedGroup?.group_id) this.getLiveStream();
    this.modalService.open(modal, {
      centered: true,
      backdrop: false,
      size: "lg",
      container: ".dashboard-group-chat",
      windowClass: "modal modal-primary",
    });
    this.isViewStreamModal = true;
  }
  public getLiveStreams = [];
  liveTsreamList() {
    this.deviceManagementSvc
      .getLiveStreams(this.selectedGroup.group_id)
      .subscribe((res: any) => {
        if (res?.data?.streamList) this.getLiveStreams = res.data.streamList;
        else this.getLiveStreams = [];
      });
  }

  getLiveStream() {
    this.liveTsreamList();
    // notification_type: "live-stream-end"
    this.messagingService.callEndEvent.subscribe((data: any) => {
      if (data) {
        let currentLive = this.getLiveStreams.findIndex((val: any) => {
          return val.stream_key == data.stream_link;
        });
        this.liveTsreamList();
        // if(currentLive > -1 && data.notification_type == "live-stream-end") this.getLiveStreams.splice(currentLive, 1)
      }
    });
  }

  // open confirm modal
  openCofirmModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.confrimModal, {
      centered: true,
      backdrop: false,
      // scrollable: true,
      size: "sm",
      container: ".dashboard-group-chat",
      // windowClass: "modal modal-primary",
    });
  }
  // Open in new tab
  openInNewTab() {
    if (this.isViewStreamModal) {
      this.openLiveStream(this.viewStreamData);
    } else if (this.isIPStreamModal) {
      this.openIPStream(this.ipStreamData);
    }
  }

  //open IP stream
  openIPStream(payload) {
    this.deviceManagementSvc.getVideoUrl(payload).subscribe((res: any) => {
      if (res.success === true) {
        this.modalService.dismissAll();
        let stream_data = {
          stream_link: res.data.link,
          pid: res.data.pid,
        };
        this._toastrService.success(res.message, "Success", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
        if (stream_data || stream_data !== null) {
          this.openNewTab(stream_data);
        }
      } else {
        this._toastrService.error(res.message, "Error", {
          toastClass: "toast ngx-toastr",
          closeButton: true,
        });
      }
    });
  }

  checkRoute(){
    // let urls=this.router.url;
    let urls=window.location.href;
    const lastSegment = urls.split("/").pop();
    if (lastSegment=="video-player" || lastSegment=="conference-call"){
      this.el=true;
    }
  }

  // open View Stream
  openLiveStream(stream_data) {
    if (stream_data && stream_data !== null) {
      // window.open("video-player", "_blank");
      let newWin = window.open(
        "video-player",
        "_blank",
        "width=1000,height=800,left=200,top=200"
      );
      newWin["stream_data"] = stream_data;
      this.modalService.dismissAll();
    }
    else{
      alert(stream_data);
    }
  }

  //ip stream fn//
  openVideo(data) {
    // this.openCofirmModal();
    let payload = {
      link: data,
    };
    this.ipStreamData = payload;
    this.openInNewTab();
  }

  openNewTab(stream_data) {
    if (stream_data && stream_data !== null) {
      let newWin = window.open(
        "video-player",
        "_blank",
        "width=1000,height=800,left=200,top=200"
      );
      newWin["stream_data"] = stream_data;
      this.modalService.dismissAll();
    }
    // }, 100);
  }

  getCurrentVideo(data) {
    let stream_data = {
      stream_link: data["stream_key"],
    };
    this.viewStreamData = stream_data;
    this.openInNewTab();
  }

  // Add Pin drop Switch
  onAddPinDropSwitchChange(eve) {
    let data: pinDropVar = {
      addPinDrop: eve.target.checked,
    };
    // this.messagingService.onPinDropSwtichChange.next(eve.target.checked);
    this.messagingService.onSwitchChnage(data);
    eve.stopPropagation();
  }

  // On Move pin drop switch changge
  onMovePinDropSwitchChange(eve) {
    let data: pinDropVar = {
      movePinDrop: eve.target.checked,
    };
    // this.messagingService.onPinDropSwtichChange.next(eve.target.checked);
    this.messagingService.onSwitchChnage(data);
    eve.stopPropagation();
  }

  // Get Member's Name color
  getMemberColor(jid) {
    this.selectedGroupMemersData.forEach((ele) => {
      if (ele.user.jid && ele.user.jid == jid) {
        return `color : ${ele.user.color}`;
      }
    });
  }
  //image Modal
  imageViewModal(imageUrl) {
    this.currentImage =imageUrl;
    this.modalService.dismissAll();
    this.modalService.open(this.ViewImgModal, {
      centered: true,
      backdrop: false,
      size: "sm",
      container: ".dashboard-group-chat",
      // windowClass: "modal modal-primary",
    });
  }

  // Conference call modal open
  openConferenceCallmModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.conferenceCallModal, {
      centered: true,
      backdrop: false,
      size: "sm",
      container: ".dashboard-group-chat",
      // windowClass: "modal modal-primary",
    });
  }

  openConferenceCall() {
    if (!this.selectedGroup.is_call_active) {
      this.eventMessage = {
        toGroup: this.selectedGroup.room_jid,
        groupId: this.selectedGroup.group_id,
        groupName: this.selectedGroup.name,
        groupImageUrl: this.selectedGroup.image || "",
        message: `${this.currentLoggedInUser.name} has started group call`,
        eventType: EventTypes.startAudioCall,
      };
      this.xamppSvc.onEventMessageStanza(this.eventMessage);
    }
    localStorage.setItem(
      "conferenceCallData",
      JSON.stringify(this.selectedGroup)
    );
    setTimeout(() => {
      this.modalService.dismissAll();
      let newWin = window.open(
        "conference-call",
        "_blank",
        "width=1400,height=800,left=200,top=200"
      );
      newWin;
    }, 100);
  }

  // Start or Join Conference Call
  conferenceCallSideBar(name): void {
    // this.messagingService.incomingCallEvent.emit(this.selectedGroup);
    // this.chatsSvc.onAnswerCallClicked(true);
    // this.chatsSvc.callStatus(true);
    // setTimeout(() => {
    //   this._coreSidebarService.getSidebarRegistry(name)?.toggleOpen();
    // }, 300);
  }
}
