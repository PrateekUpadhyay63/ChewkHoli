import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetLocalUserService {

  constructor() { }

  getLoggedInUserData() {
  return JSON.parse(localStorage.getItem("currentUser"));
  }
}
