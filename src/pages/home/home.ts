import { Component } from '@angular/core';
import { NavController, Events, Alert, AlertController } from 'ionic-angular';
import { ReportAccidentPage } from '../report-accident/report-accident';
import { ViewAccidentsPage } from '../view-accidents/view-accidents';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public events: Events, public alertCtrl: AlertController) {

  }

  reportAccident(){
    this.navCtrl.push(ReportAccidentPage);
  }

  viewAccidents(){
    this.navCtrl.push(ViewAccidentsPage);
  }

  logout() {
    const alert: Alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to logout ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Logout',
        handler: () => {
          this.events.publish('user:logout');
        }
      }]

    });
    alert.present();
  }

}
