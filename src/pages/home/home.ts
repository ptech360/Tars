import { Component } from '@angular/core';
import { NavController, Events, Alert, AlertController } from 'ionic-angular';
import { ReportAccidentPage } from '../report-accident/report-accident';
import { ViewAccidentsPage } from '../view-accidents/view-accidents';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public events: Events, public alertCtrl: AlertController, public auth: AuthProvider) {

  }

  reportAccident() {
    this.navCtrl.push(ReportAccidentPage);
  }

  viewAccidents() {
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
          this.auth.logout().subscribe((res) => {
            this.events.publish('user:logout');
          }, error => {
            this.events.publish('user:logout');
          })
        }
      }]

    });
    alert.present();
  }

}
