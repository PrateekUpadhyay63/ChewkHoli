import { Component, OnInit } from '@angular/core';
import { locale as english } from './i18n/en';
import { locale as arabic } from './i18n/ar';
import { CoreTranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  constructor(private _coreTranslationService: CoreTranslationService,) { this._coreTranslationService.translate(english, arabic); }
  activeId: any = 1;
  
  ngOnInit(): void {
    if(localStorage.getItem('streamTab')) this.activeId = parseInt(localStorage.getItem('streamTab'))
  }

  onNavChange(event) {
    localStorage.setItem("streamTab", event?.nextId);
    this.activeId = event?.nextId;
  }

}
