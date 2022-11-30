import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'app/auth/service';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private _authenticationService: AuthenticationService) { }

  async transform(src: string): Promise<string> {
    // if (src.indexOf(';base64,') > -1) {
    //     return src;
    // }

    // add dynamically from localstora
    
    let token = this._authenticationService.currentUserValue.token
    const headers = new HttpHeaders({ 'Authorization': `${token}` });    
    const imageBlob = await this.http.get(src, { headers, responseType: 'blob' }).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
    });
}


}