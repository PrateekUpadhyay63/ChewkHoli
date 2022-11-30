import { Component, OnInit } from "@angular/core";
import { LiveService } from "./live.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { VideoPlaylistService } from "../../device-management/video-player/video-playlist.service";
import { locale as english } from "./i18n/en";
import { locale as arabic } from "./i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
@Component({
  selector: "app-live",
  templateUrl: "./live.component.html",
  styleUrls: ["./live.component.scss"],
})
export class LiveComponent implements OnInit {
  public getLiveStreams = [];
  selectedChat: any;
  user = [];
  liveUrls= [];
  selectedGroup
  constructor(
    private liveSvc: LiveService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private videoPlayList: VideoPlaylistService,
    private _coreTranslationService: CoreTranslationService,
  ) { this._coreTranslationService.translate(english, arabic);}

  ngOnInit(): void {
    this.getGroups();
    // if(localStorage.getItem("streamLive")){
    //   this.selectedGroup = JSON.parse(localStorage.getItem("streamLive"));
    //   this.getLiveStream(this.selectedGroup.id);
    // }
  }

  filterByDays($event) {
    localStorage.setItem("streamLive", JSON.stringify($event));    
    this.getLiveStream($event.id);
  }

  getGroups() {
    this.liveSvc.getGroupId().subscribe((res: any) => {
      this.user = res.data;
    });
  }

  openVideo(data) {
    let payload = {
      link: data,
      pid:1,
    };
        this.router.navigate(["/video-player"]);
        this.videoPlayList.fetchList(payload.link, payload.pid);

  }

  clearDropDown(){
    this.getLiveStreams = [];
  }

  getLiveStream(_id) {
    this.liveSvc.getLiveStreams(_id).subscribe((res: any) => {
      if (res?.data?.streamList) this.getLiveStreams = res.data.streamList;
      this._toastrService.success(res.message, "Success!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
    });
  }
}
