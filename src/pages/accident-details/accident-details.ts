import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.accident = this.navParams.get('accident');
    console.log(this.accident);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccidentDetailsPage');
  }

}
