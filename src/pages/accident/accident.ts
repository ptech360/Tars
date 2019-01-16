import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AccidentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-accident',
  templateUrl: 'accident.html',
})
export class AccidentPage {
  accident: any;
  bucketUrl = "http://localhost:8080/api/getImage?fileName=";
  accessToken = "&access_token=" + localStorage.getItem('access_token');

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.accident = this.navParams.get('accident');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentPage');
  }

}
