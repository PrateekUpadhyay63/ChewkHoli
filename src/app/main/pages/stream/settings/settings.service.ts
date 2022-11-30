import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient,) { }

  updateStreamDuration(data) {
    return this.http.patch(
      `${environment.apiUrl}//stream/settings/save-time-update`,
      data
    );
  }

}

