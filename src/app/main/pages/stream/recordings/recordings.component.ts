import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { VideoPlaylistService } from "../../device-management/video-player/video-playlist.service";
import { LiveService } from "../live/live.service";
import { locale as english } from "../live/i18n/en";
import { locale as arabic } from "../live/i18n/ar";
import { CoreTranslationService } from "@core/services/translation.service";
@Component({
  selector: "app-recordings",
  templateUrl: "./recordings.component.html",
  styleUrls: ["./recordings.component.scss"],
})
export class RecordingsComponent implements OnInit {
  public recordings = [];
  selectedChat: any;
  user = [];
  selectedGroup;

  constructor(
    private liveSvc: LiveService,
    private _toastrService: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private videoPlayList: VideoPlaylistService,
    private _coreTranslationService: CoreTranslationService,
  ) {this._coreTranslationService.translate(english, arabic);}

  ngOnInit(): void {
    this.getGroups();
  }

  getRecordings(_id) {
    this.liveSvc.getRecording(_id).subscribe((res: any) => {
      if (res?.data?.attachmentList) this.recordings = res.data.attachmentList;
      this._toastrService.success(res.message, "Success!", {
        toastClass: "toast ngx-toastr",
        closeButton: true,
      });
    });
  }

  openVideo(data) {
    let payload = {
      link: data,
      pid: 1,
    };
    this.router.navigate(["/video-player"]);
    this.videoPlayList.fetchList(payload.link, payload.pid);
  }

  getGroups() {
    this.liveSvc.getGroupList().subscribe((res: any) => {
      this.user = res.data;
    });
  }

  clearDropDown() {
    this.recordings = [];
  }

  filterByGroup($event) {
    if ($event) this.getRecordings($event?.group_id);
    else {
      this.selectedGroup = undefined;
      this.recordings = [];
    }
  }
}
