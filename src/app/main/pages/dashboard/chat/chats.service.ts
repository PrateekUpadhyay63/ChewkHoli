import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { GetLocalUserService } from "app/shared/services/get-local-user.service";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

export interface callStreamingStatus{
  isCallActive:boolean,
  isLiveStreamingActive: boolean
}
@Injectable()
export class ChatsService {
  public onGroupListChange: BehaviorSubject<any>;
  public groupList = [];
  public loggedInUserData: any;
  constructor(
    private _httpClient: HttpClient,
    private getLoggedInUserData: GetLocalUserService
  ) {
    this.onGroupListChange = new BehaviorSubject([]);
    this.loggedInUserData = this.getLoggedInUserData.getLoggedInUserData();
  }

  // get chat group list by user id

  membersData = new BehaviorSubject<any>(undefined);
  getChatGroupList(id: number) {
    return this._httpClient
      .get(`${environment.apiUrl}/chat-groups/${id}`)
      .subscribe((res: any) => {
        this.groupList = res;
        this.onGroupListChange.next(this.groupList);
      });
  }

  // get members list for selected group
  getChatGroupMmebersList(id: number) {
    return this._httpClient.get(`${environment.apiUrl}/chat-group/${id}`);
  }

  // get streaming device for dashboard
  getAllStreamingDevicesDashboard(params) {
    let url = new URL(`${environment.apiUrl}/dashboard-streaming-devices/${params.id}`);
    let paramemters = new URLSearchParams(url.search);
    if (JSON.parse(localStorage.getItem("currentUser")).Role.id != "5")
      // paramemters.set("organization_id", JSON.parse(localStorage.getItem("currentUser")).Organization.id);
    paramemters.set("page", params.pageNumber);
    paramemters.set("size", params.pageSize);
    url.search = paramemters.toString();
    return this._httpClient.get(url.toString());
  }

  //Get Member location's for selected group
  getMemberLocationById(id: number) {
    return this._httpClient.get(
      `${environment.apiUrl}/group-members-location/${id}`
    );
  }

  //upload attachment
  uploadAttachment(data) {
    return this._httpClient.post(
      `${environment.apiUrl}/mobile/upload-attachment`,
      data
    );
  }

  // get groups by search
  getGroupBySearch(id: number, search: string) {
    return this._httpClient.get(
      `${environment.apiUrl}/chat-groups/${id}?search=${search}`
    );
  }

  //send call notification
  sendCallNotification(payload) {
    return this._httpClient.post(
      `${environment.apiUrl}/mobile/send-call-notification`,
      payload
    );
  }

  @Output() onAnswerCallEvent = new EventEmitter<boolean>();
  onAnswerCallClicked(msg: boolean) {
    this.onAnswerCallEvent.emit(msg);
  }

  @Output() callEndEvent = new EventEmitter<any>();
  endCall(data) {
    this.callEndEvent.emit(data);
  }

  @Output() openSidebarEvent = new EventEmitter<boolean>();
  sideBarOpenEvent(open: boolean) {
    this.openSidebarEvent.emit(open);
  }

  @Output() alreadyOnCall = new EventEmitter<boolean>();
  callStatus(data: boolean) {
    this.alreadyOnCall.emit(data);
  }

  @Output() isCallActive = new EventEmitter<callStreamingStatus>();
  isCallActiveCheck(data: callStreamingStatus) {
    this.isCallActive.emit(data);
  }

  // on reply message click
  @Output() onReplyClicked = new EventEmitter<boolean>();
  onReplyMessageClick(data: boolean) {
    this.onReplyClicked.emit(true);
  }
  // // Get members data for color 
  // @Output() selectGroupMembers = new EventEmitter<any>();
  // onGroupMembers(data) {
  //   this.selectGroupMembers.emit(data);
  // }
}
