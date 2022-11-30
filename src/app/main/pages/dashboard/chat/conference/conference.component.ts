import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
declare var JitsiMeetJS: any;

@Component({
  selector: "app-conference",
  templateUrl: "./conference.component.html",
  styleUrls: ["./conference.component.scss"],
})
export class ConferenceComponent implements OnInit {
  isShowDiv = false;
  // jisti
  // Jisti
  public options;
  public roomName;
  public token;
  public user = "subhash ramshetty";
  public connection = null;
  public isJoined = false;
  public room = null;
  public localTracks = [];
  public remoteTracks = {};
  public participantIds = new Set();
  @ViewChild("one") d1: ElementRef;
  constructor(private _coreSidebarService: CoreSidebarService) {}
  ngOnInit(): void {
    JitsiMeetJS.init();
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // toogle-chat
  toggleChat() {
    this.isShowDiv = !this.isShowDiv;
  }

  close() {
    this.isShowDiv = false;
  }

  endCall() {
    this.beforeCallStart();
    // this.disconnect();
  }

  // Build option for Jisti meet
  buildOptions(roomName) {
    return {
      connection: {
        hosts: {
          domain: "dbvoicedev.iworklab.com",
          muc: `conference.dbvoicedev.iworklab.com`,
          focus: "focus.dbvoicedev.iworklab.com",
        },
        serviceUrl: `https://dbvoicedev.iworklab.com/http-bind?room=${roomName}`,
        clientNode: "http://jitsi.org/jitsimeet",
      },
      conference: {
        enableLayerSuspension: true,
        p2p: {
          enabled: false,
        },
      },
    };
  }

  beforeCallStart() {
    JitsiMeetJS.init();
    const tenant = "subhash";
    this.roomName = "rahul";
    this.options = this.buildOptions(this.roomName);
    // token = $("#tokenInput").val();
    this.connection = new JitsiMeetJS.JitsiConnection(
      null,
      null,
      this.options.connection
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.disconnect
    );
    this.connection.connect();
    JitsiMeetJS.createLocalTracks({ devices: ["audio"] })
      .then(this.onLocalTracks)
      .catch((error) => {
        throw error;
      });
  }

  // need to be modified
  onLocalTracks = (tracks) => {
    this.localTracks = tracks;
    for (let i = 0; i < this.localTracks.length; i++) {
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        (audioLevel) => console.log(`Audio Level local: ${audioLevel}`)
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log("local track muted")
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log("local track stoped")
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId) =>
          console.log(`track audio output device was changed to ${deviceId}`)
      );
      if (this.localTracks[i].getType() === "audio") {
        this.d1.nativeElement.insertAdjacentHTML(
          "beforeend",
          `<audio autoplay='1' muted='true' id='localAudio${i}' />`
        );
        // $('div').append(
        //     `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
        //     this.localTracks[i].attach($(`#localAudio${i}`)[0]);
        var elem = document.getElementById(`localAudio${i}`);
        console.log("element", this.d1);
        this.localTracks[i].attach(elem);
      }
      if (this.isJoined) {
        this.room.addTrack(this.localTracks[i]);
      }
    }
  };

  // need to be modified
  onRemoteTrack = (track) => {
    const participant = track.getParticipantId();

    if (!this.remoteTracks[participant]) {
      this.remoteTracks[participant] = [];
    }
    const idx = this.remoteTracks[participant].push(track);
    const id = participant + track.getType() + idx;

    if (track.getType() === "video") {
      // $('body').append(
      //     `<video autoplay='1' id='${participant}video${idx}' />`);
    } else {
      this.d1.nativeElement.insertAdjacentHTML(
        "beforeend",
        `<audio autoplay='1' id='${participant}audio${idx}' />`
      );
      // $('div').append(
      //     `<audio autoplay='1' id='${participant}audio${idx}' />`);
    }
    // track.attach($(`#${id}`)[0]);
  };

  public onConnectionSuccess = () => {
    this.room = this.connection.initJitsiConference(
      "rahul",
      this.options.conference
    );
    this.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, (track) => {
      !track.isLocal() && this.onRemoteTrack(track);
    });
    this.room.on(
      JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      this.onConferenceJoined
    );
    this.room.on(JitsiMeetJS.events.conference.USER_JOINED, this.onUserJoined);
    this.room.on(JitsiMeetJS.events.conference.USER_LEFT, this.onUserLeft);
    this.room.join();
    this.room.isStartAudioMuted();
    this.room.setReceiverVideoConstraint(720);
  };

  // On conference call joined
  onConferenceJoined = () => {
    this.isJoined = true;
    for (let i = 0; i < this.localTracks.length; i++) {
      this.room.addTrack(this.localTracks[i]);
    }
  };

  onUserLeft = (id) => {
    this.participantIds.delete(id);
    this.room.selectParticipants(Array.from(this.participantIds));
  };

  onUserJoined = (id) => {
    this.participantIds.add(id);
    this.room.selectParticipants(Array.from(this.participantIds));
  };

  onConnectionFailed = () => {
    console.error("Connection Failed!");
  };

  disconnect = () => {
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess
    );
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed
    );
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.disconnect
    );
  };

  // Close all resources when closing the page.
  disconnectAll = () => {
    for (let i = 0; i < this.localTracks.length; i++) {
      this.localTracks[i].dispose();
    }
    if (this.room) {
      this.room.leave();
    }
    if (this.connection) {
      this.connection.disconnect();
    }
  };
}
