import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  url: string = 'http://localhost:8080';

  constructor(public http: HttpClient, public alertCtrl: AlertController) {
  }

  private getAccessToken() {
    return !localStorage.getItem('access_token') ? 'Basic ZWZrb24tYXRjczpueHRsaWZl' : 'Bearer ' + localStorage.getItem('access_token');
  }

  addRequestOptions(reqOpts: any){
    reqOpts['observe'] = 'response';
    reqOpts.headers = {};
    reqOpts.headers['Authorization'] = this.getAccessToken();
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    this.addRequestOptions(reqOpts);
    return this.http.get<Observable<HttpResponse<Object>>>(this.url + '/' + endpoint, reqOpts).map(this.extractData)
      .catch(this.handleError);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    this.addRequestOptions(reqOpts);
    return this.http.post<Observable<HttpResponse<Object>>>(this.url + '/' + endpoint, body, reqOpts)
      .map(this.extractData)
      .catch(this.handleError);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    this.addRequestOptions(reqOpts);
    return this.http.put<Observable<HttpResponse<Object>>>(this.url + '/' + endpoint, body, reqOpts)
      .map(this.extractData)
      .catch(this.handleError);
  }

  delete(endpoint: string, reqOpts?: any) {
    this.addRequestOptions(reqOpts);
    return this.http.delete<Observable<HttpResponse<Object>>>(this.url + '/' + endpoint, reqOpts)
      .map(this.extractData)
      .catch(this.handleError);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    this.addRequestOptions(reqOpts);
    return this.http.put<Observable<HttpResponse<Object>>>(this.url + '/' + endpoint, body, reqOpts)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: HttpResponse<any>) {

    // console.log('inside extract data', res);
    return res.body || res.status;
  }

  private handleError(err: HttpErrorResponse) {
    // console.log('inside handle error', err);
    let errorInfo: any = {};

    if (err.error instanceof Error || err.error instanceof ProgressEvent) {
      /**A client-side or network error occurred. Handle it accordingly.*/
      // console.log('An error occurred:', );
      errorInfo.status = err.status;
      errorInfo.status == 0 ? errorInfo.message = "Some error occured, couldn\'t conect to server" : errorInfo.message = err.message || 'Some Error Occured';

    }
    else {
      /**The backend returned an unsuccessful response code.*/
      // console.log('Server occurred:', err);
      errorInfo.status = err.status;
      errorInfo.message = err.error.message || err.error.error || 'Internal Server Error';
    }
    this.showError(errorInfo.message);
    return Observable.throw(errorInfo);
  }

  showError(message){
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    })
    alert.present();
  }

}
