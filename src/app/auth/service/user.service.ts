import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get all users
   */
  getAll() {
    return this._http.get<User[]>(`${environment.apiUrl}/users`);
  }

  /**
   * Get user by id
   */
  getById(id: number) {
    return this._http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  updateReq(url, id, data) {
    return this._http.patch<User>(`${environment.apiUrl}/${url}/${id}`, data);
  }

  getAllReq(url) {
    return this._http.get<User>(`${environment.apiUrl}/${url}`);
  }

  getAllCms() {
    return new Promise((resolve, reject) => {
      this.getAllReq("get-all-cms").subscribe((data) => {
        resolve(data)
      })
    })

  }

  SubmitCms(dataToSend) {
    return new Promise((resolve, reject) => {
      this.updateReq('update-cms', 1, dataToSend).subscribe((data) => {
        resolve(data);
      })
    })
  }

}
