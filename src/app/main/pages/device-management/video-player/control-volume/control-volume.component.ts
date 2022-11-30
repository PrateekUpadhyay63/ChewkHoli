import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../volume.service';


@Component({
  selector: 'app-control-volume',
  templateUrl: './control-volume.component.html',
  styleUrls: ['./control-volume.component.scss']
})
export class ControlVolumeComponent implements OnInit {
  public volume = 1;
  public maxVolumeValue = 1;
 public mute:number = 1;
 public notMute:number = 0;
  private savedVolume = 1;

  constructor(private volumeService: VolumeService) {}

  public ngOnInit() {
    this.volumeService.volumeValue$.subscribe(volume => this.volume = volume);
  }

  public onVolumeClick() {
    this.savedVolume = this.volume === 0 ? this.mute = 0 : this.notMute = 1;
    console.log("volume", this.savedVolume);
    if(this.mute){
      this.notMute = 1;
    }this.mute = 0;
    this.volumeService.setVolumeValue(this.volume > 0 ? 0 : this.savedVolume);
  }

  // public onInput(event: MatSliderChange) {
  //   this.volumeService.setVolumeValue(event.value);
  // }

  // public get icon() {
  //   // console.log("clicked")
  //   return this.volume === 0 ? this.iconVolumeMute.value : this.iconVolumeUp.value;
  // }

  public inputHandler(event) {
    console.log("eve",event.target.value)
    if(event.target.value > 0){
      this.mute = 1;
      this.notMute = 0
    }else if(event.target.value == 0){
      this.notMute = 1;
      this.mute = 0;
    } 
    // this.input.emit(event);
    this.volumeService.setVolumeValue(event.target.value);
    // this.maxVolumeValue = event.target.value;
  }

  public changeHandler(event) {
    // this.change.emit(event);
  }


}
