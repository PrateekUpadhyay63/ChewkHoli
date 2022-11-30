import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VideoService } from './video.service';

@Injectable({
  providedIn: 'root'
})
export class VideoPlaylistService {
  // private list = new BehaviorSubject<PlaylistItem[]>([]);
  private currentVideo = new BehaviorSubject<string>('');
  private currentPId = new BehaviorSubject<number>(null);
  // private shouldPlayNext = new BehaviorSubject<boolean>(true);

  public constructor(private videoService: VideoService) {}

  public get currentVideo$(): Observable<string> {
    return this.currentVideo.asObservable();
  }

  public get currentProceeId$(): Observable<number> {
    return this.currentPId.asObservable();
  }

  public setCurrentVideo(video: string, pid:number): void {
    // console.log(this.currentVideo.getValue(), video);
    
    if (this.currentVideo.getValue() !== video) {
      this.currentVideo.next(video);
      this.currentPId.next(pid);
      // console.log("video url stream",video)
      this.videoService.pause();
    }
  }

  public fetchList(endpoint: string, pid:number): void {
    this.setCurrentVideo(endpoint, pid);
  }

  public setViewStreamVideo(video: string): void {
    // console.log(this.currentVideo.getValue() != video);
    
    if (this.currentVideo.getValue() != video) {
      // console.log(video);
      
      this.currentVideo.next(video);
      // this.currentPId.next(pid);
      // console.log("video url stream",video)
      // this.videoService.pause();
    }
  }

  public fetchListViewStream(endpoint: string): void {
    this.setViewStreamVideo(endpoint);
  }
}
