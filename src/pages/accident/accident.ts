import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccidentProvider } from '../../providers/accident/accident';

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
  bucketUrl: string;
  accessToken = "&access_token=" + localStorage.getItem('access_token');

  constructor(public navCtrl: NavController, public navParams: NavParams, public accidentProvider: AccidentProvider) {
    this.bucketUrl = this.accidentProvider.getBaseUrl() + "/api/getImage?fileName=";
    this.accident = this.navParams.get('accident');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentPage');
  }

}
