import { Component, ElementRef, Input, ViewChild, OnInit,ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as HLS from "hls.js";
import { DeviceManagementService } from "../../device-management.service";
import { VideoPlaylistService } from "../video-playlist.service";
import { VideoTimeService } from "../video-time.service";
import { VideoService } from "../video.service";
import { VolumeService } from "../volume.service";
import { Location } from "@angular/common";
import { MinMaxPopupModule, MinMaxDirective } from 'min-max-popup';
import {CdkPortal,DomPortalHost} from '@angular/cdk/portal';
@Component({
  selector: "app-video-wraper",
  templateUrl: "./video-wraper.component.html",
  styleUrls: ["./video-wraper.component.scss"],
})
export class VideoWraperComponent implements OnInit {
  // @Input() data: any = {}; //add this
  // @Input() parentRef: any; //add this
  // @Input() unique_key: any; //add this
  // @ViewChild(CdkPortal) portal: CdkPortal;
  public loading: boolean;
  public ignore: boolean;
  public playing = false;
  public videoEnded = false;
  public isPlaying = true;
  public isPlayingPushed = false;
  public currentUrl: string = null;
  public processId: number;
  public token = JSON.parse(localStorage.getItem("currentUser"));
  private externalWindow = null;
  private hls = new HLS({
    xhrSetup: (xhr) => {
      xhr.setRequestHeader("Authorization", `${this.token.token}`);
      xhr.setRequestHeader("language-id", `${this.token.Language.code}`);
    },
  });
  public duration = 0;
  public urlData;
  // public urlLastValue:any
  public currentProgress = 0;
  private videoListeners = {
    loadedmetadata: () =>
      this.videoService.setVideoDuration(this.video.nativeElement.duration),
    canplay: () => this.videoService.setLoading(false),
    seeking: () => this.videoService.setLoading(true),
    timeupdate: () => {
      if (!this.ignore) {
        this.videoTimeService.setVideoProgress(
          this.video.nativeElement.currentTime
        );
      }
      if (
        this.video.nativeElement.currentTime ===
          this.video.nativeElement.duration &&
        this.video.nativeElement.duration > 0
      ) {
        this.videoService.pause();
        this.videoService.setVideoEnded(true);
      } else {
        this.videoService.setVideoEnded(false);
      }
    },
  };

  @ViewChild("video", { static: true })
  private readonly video: ElementRef<HTMLVideoElement>;

  constructor(
    private videoService: VideoService,
    private volumeService: VolumeService,
    private videoTimeService: VideoTimeService,
    private videoPlayList: VideoPlaylistService,
    private router: Router,
    private minmaxservice: MinMaxDirective,
    private location: Location,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  public ngOnInit() {
    // this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

    // const host = new DomPortalHost(
    //   this.externalWindow.document.body,
    //   this.componentFactoryResolver,
    //   this.applicationRef,
    //   this.injector
    //   );

    // host.attach(this.portal);
    // this.urlData = this.route.snapshot.params;
    // console.log("data", this.urlData);

    this.subscriptions();
    this.videoService.videoDuration.subscribe((duration) => {
      this.duration = duration;
    });
    Object.keys(this.videoListeners).forEach((videoListener) =>
      this.video.nativeElement.addEventListener(
        videoListener,
        this.videoListeners[videoListener]
      )
    );

    /* time service */
    this.videoService.playingState$.subscribe(
      (playing) => (this.playing = playing)
    );
    this.videoTimeService.videoDuration$.subscribe(
      (duration) => (this.duration = duration)
    );
    this.videoTimeService.videoProgress$.subscribe(
      (progress) => (this.currentProgress = progress)
    );
    this.videoService.videoEnded$.subscribe(
      (ended) => (this.videoEnded = ended)
    );
  }

  /** Play/Pause video on click */
  public onVideoClick() {
    if (this.playing) {
      this.isPlaying = false;
      this.isPlayingPushed = true;
      this.videoService.pause();
    } else {
      this.isPlaying = true;
      this.isPlayingPushed = false;
      this.videoService.play();
    }
  }

  // close() {
  //   this.parentRef.remove(this.unique_key)
  // }

  /** Go full screen on double click */
  public onDoubleClick() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const videoPlayerDiv = document.querySelector(".video-player");
      if (videoPlayerDiv.requestFullscreen) {
        videoPlayerDiv.requestFullscreen();
      }
    }
  }

  /**
   * Loads the video, if the browser supports HLS then the video use it, else play a video with native support
   */
  public load(currentVideo: string): void {
    console.log("currenturl", currentVideo);

    if (currentVideo) {
      let url = currentVideo.includes(".mp4");
      // let url = currentVideo.includes(".flv");
      if (HLS.isSupported() && !url) {
        this.loadVideoWithHLS(currentVideo);
      } else {
        if (this.video.nativeElement.canPlayType("video/mp4")) {
          this.loadVideo(currentVideo);
        }
      }
    }
  }

  /**
   * Play or Pause current video
   */
  private playPauseVideo(playing: boolean) {
    this.playing = playing;
    this.video.nativeElement[playing ? "play" : "pause"]();
  }

  /**
   * Setup subscriptions
   */
  private subscriptions() {
    this.videoService.playingState$.subscribe((playing) =>
      this.playPauseVideo(playing)
    );
    // let url =  'https://dbstreamdev.iworklab.com/live/468/index.m3u8'
    //  "https://dbstreamdev.iworklab.com/live/123.flv";
    // "http://172.105.55.116:3031/live/462.flv"
    // this.load(url);
    // if(getLink) {
    //   this.currentUrl = getLink;
    //   this.load(getLink)
    // }
    this.videoPlayList.currentVideo$.subscribe((video) => {
      console.log(window["stream_data"],"video");
      if (video) {
        this.currentUrl = video;
      } else if (!video) {
        let getLink = window["stream_data"];
        console.log(getLink,"getLink")
        if (getLink) {
          this.currentUrl = getLink.stream_link;
          setTimeout(() => {
            this.removeStreamLink();
          }, 5000);
        }
      }
      this.load(this.currentUrl);
      // else if(!this.currentUrl) {
      //   console.log("caleed",);
      //   alert("Link expired..! Redirecting to dashboard");
      //   this.router.navigateByUrl("/dashboard");
      // }
    });
    this.videoPlayList.currentProceeId$.subscribe((pId) => {
      if (pId) {
        this.processId = pId;
      } else {
        let getLink = window["stream_data"];
        if (getLink) this.processId = getLink.pid;
      }
    });
    this.videoTimeService.currentTime$.subscribe(
      (currentTime) => (this.video.nativeElement.currentTime = currentTime)
    );
    this.volumeService.volumeValue$.subscribe(
      (volume) => (this.video.nativeElement.volume = volume)
    );
    this.videoService.loading$.subscribe((loading) => (this.loading = loading));
    this.videoTimeService.ignore$.subscribe((ignore) => (this.ignore = ignore));
  }

  /**
   * Method that loads the video with HLS support
   */
  private loadVideoWithHLS(currentVideo: string) {
    this.hls.loadSource(currentVideo);
    this.hls.attachMedia(this.video.nativeElement);
    this.hls.on(HLS.Events.MANIFEST_PARSED, () =>
      this.video.nativeElement.play()
    );
  }

  /**
   * Method that loads the video without HLS support
   */
  private loadVideo(currentVideo: string) {
    this.video.nativeElement.src = currentVideo;
  }
  //full screen
  public onFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const videoPlayerDiv = document.querySelector(".video-player");
      if (videoPlayerDiv.requestFullscreen) {
        videoPlayerDiv.requestFullscreen();
      }
    }
  }
  // play pause
  public onPlayClick() {
    this.playing = true;
    if (this.playing) {
      this.isPlaying = false;
      this.isPlayingPushed = true;
      this.videoService.pause();
    }
  }

  onPauseClicked() {
    this.playing = false;
    this.isPlaying = true;
    this.isPlayingPushed = false;
    this.videoService.play();
  }

  // progress bar
  public onInput(event): void {
    this.videoTimeService.setIgnore(true);
    this.videoTimeService.setVideoProgress(event.target.value);
  }

  public onChange(event) {
    this.videoTimeService.setIgnore(false);
    this.videoTimeService.setCurrentTime(event.target.value);
  }

  cancel() {
    let back: any = this.location.back();
    if (back) {
      this.location.back();
    } else {
      this.router.navigateByUrl("/dashboard");
    }
  }

  // remove link from local storage
  removeStreamLink() {
    let getLink = JSON.parse(localStorage.getItem("link"));
    if (getLink) localStorage.removeItem("link");
  }
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  ngOnDestroy(): void {

    let payload = {
      link: this.currentUrl,
      pid: this.processId,
    };
    // check if the stream is RTSP stream.
    if (payload.pid) {
      this.videoService.stopStream(payload).subscribe((res) => {
        // console.log("vide stoped", res);
      });
    }
    this.hls.destroy();
    this.removeStreamLink();
    // console.log("destroy called...");

    this.externalWindow.close();
  }
}
