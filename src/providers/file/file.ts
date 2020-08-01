import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare let VanillaFile: any;
/*
  Generated class for the FileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FileProvider Provider');
  }

  getFile(u8arr, filename, mime) {
    const f = new VanillaFile([u8arr], filename, { type: mime });
    return f;
  }
}
