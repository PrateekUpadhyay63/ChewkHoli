import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LiveService {

  constructor(private http: HttpClient,) { }
  //mobile get live streams by group id.
  getLiveStreams(group_id:number){
    return this.http.get(`${environment.apiUrl}/mobile/get-live-streams/${group_id}`);
  }

  getRecording(group_id:number){
    return this.http.get(`${environment.apiUrl}/stream/recordings/${group_id}`);
  }

  getGroupId(){
    return this.http.get(`${environment.apiUrl}/mobile/live-stream-groups`);
  }

  getGroupList(){
    return this.http.get(`${environment.apiUrl}/groups-list`);
  }

  getVideoUrl(url){
    return this.http.post(`${environment.apiUrl}/videos`, url);
   }
}
