import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferAuthorityService {

  constructor(private httpClient:HttpClient) { }

   //get all organization list 
   getOrgList(){
    return this.httpClient.get(`${environment.apiUrl}/organizations-list`);
  }

   //get all trasfer from list
   getTransferFromList(organization_id:number, role_id:number){
    return this.httpClient.get(`${environment.apiUrl}/users?organization_id=${organization_id}&roleId=${role_id}&statusId=3`);
  }

   //get all trasfer to list
   getTransferToList(organization_id:number, role_id:number){
    return this.httpClient.get(`${environment.apiUrl}/users?organization_id=${organization_id}&roleId=${role_id}&statusId=2`);
  }
  
   
   

  //Transfer Authority 
  transferAuthority(data) {
    return this.httpClient.post(`${environment.apiUrl}/transfer-authority`, data);
  }

}
