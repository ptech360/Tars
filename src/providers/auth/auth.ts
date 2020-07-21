import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient, public api:ApiProvider) {
    console.log('Hello AuthProvider Provider');
  }

  login(data){
    const options: any = {
      params: {
        grant_type: 'password',
        username:data.username,
        password:data.password
      }
    }
    return this.api.post('oauth/token',{},options);
  }
  isLoggedIn() {
    return localStorage.getItem('access_token') ? true : false;
  }

  saveToken(token: string) {
      localStorage.setItem('access_token', token);
  }

  logout(){
    return this.api.get("api/me/logout");
  }

  generatePassword(username:string){
    return this.api.get("forgot-password/"+username);
  }

  forgetPassword(reqBody){
    return this.api.post("forgot-password",reqBody);
  }

}
