import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestfulService {

  baseURL=environment.apiUrl
  authHeader:any;

  constructor(public http: HttpClient) { }
 
  getAuthorizationHeader(){
    var jwt =JSON.parse( localStorage.getItem('currentUser'));
    this.authHeader = new Headers();        
    if(jwt){
      this.authHeader.append('Content-Type','application/json');
      this.authHeader.append('Authorization',  jwt.token);
      this.authHeader.append("language-id", "EN");
    }
    else {
    this.authHeader.append('Content-Type','application/json');
    this.authHeader.append("language-id", "EN");
    }
    return {headers:this.authHeader};
  }
 get(url){
     return this.http.get(url,this.getAuthorizationHeader())
  }

  post(url,itemToPost){
    return this.http.post(url,itemToPost,this.getAuthorizationHeader())
  }
  
  patch(url,itemToPut){    
    return this.http.patch(url,itemToPut)
  }

  delete(url){
    return this.http.delete(url,this.getAuthorizationHeader())
  }

}
