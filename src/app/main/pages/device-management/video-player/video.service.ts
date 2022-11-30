import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private playingState = new Subject<boolean>();
  private loading = new BehaviorSubject<boolean>(true);
  private videoEnded = new BehaviorSubject<boolean>(false);
   videoDuration = new BehaviorSubject<number>(0);
 constructor(private http:HttpClient) {}

  public get loading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  public setLoading(value: boolean): void {
    this.loading.next(value);
  }

  public play(): void {
    this.playingState.next(true);
  }

  public pause(): void {
    this.playingState.next(false);
  }

  public get playingState$(): Observable<boolean> {
    return this.playingState.asObservable();
  }

  public get videoEnded$(): Observable<boolean> {
    return this.videoEnded.asObservable();
  }

  public setVideoEnded(value: boolean): void {
    this.videoEnded.next(value);
  }

  // video duration 
  public setVideoDuration(value: number): void {
    this.videoDuration.next(value);
  }

  // stop streaming 
  stopStream(data){
    return this.http.post(`${environment.apiUrl}/stop-conversion`, data);
  }
}
