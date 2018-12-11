import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccidentProvider } from '../../providers/accident/accident';
import { AccidentPage } from '../accident/accident';

/**
 * Generated class for the ViewAccidentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-accidents',
  templateUrl: 'view-accidents.html',
})
export class ViewAccidentsPage {
  accidents = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public accSev: AccidentProvider) {
    this.accSev.getAccidentReports().subscribe(response => {
      this.accidents = response;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAccidentsPage');
  }

  openIncidentDetailPage(index: number) {
    this.navCtrl.push(AccidentPage, { 'accident': this.accidents[index]});
  }


}
