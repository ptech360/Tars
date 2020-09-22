import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccidentProvider } from '../../providers/accident/accident';

/**
 * Generated class for the AccidentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accident-details',
  templateUrl: 'accident-details.html',
})
export class AccidentDetailsPage {
  accident: any;
  bucketUrl: any;
  accessToken = "&access_token=" + localStorage.getItem('access_token');


  constructor(public navCtrl: NavController, public navParams: NavParams, private accService: AccidentProvider) {
    this.accident = this.navParams.get('accident');
    console.log(this.accident);
    this.bucketUrl = this.accService.getBaseUrl() + '/api/media/download?name=';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentDetailsPage');
  }

  goToHome() {
    this.navCtrl.popToRoot();
  }

  encodeURIComponent(url) {
    return url.replace(/\\/g, '/');
  }
}
