import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AccidentProvider } from '../../providers/accident/accident';
import { AccidentPage } from '../accident/accident';
import { AccidentDetailsPage } from '../accident-details/accident-details';
import { ReportAccidentPage } from '../report-accident/report-accident';
import { ToastProvider } from '../../providers/toast/toast';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public accSev: AccidentProvider,
    public alertCtrl: AlertController,
    public toastSev: ToastProvider,
  ) {
    this.toastSev.showLoader();
    this.accSev.getAccidentReports().subscribe(response => {
      this.accidents = response;
      console.log(response);
      this.toastSev.hideLoader();
    }, (error => {
      this.toastSev.hideLoader();
      this.showError(error.message)
    }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAccidentsPage');
  }

  openIncidentDetailPage(index: number) {
    // this.navCtrl.push(AccidentPage, { 'accident': this.accidents[index]});
    this.navCtrl.push(AccidentDetailsPage, { 'accident': this.accidents[index] });
  }


  editAccident(index: number, e) {
    e.stopPropagation();
    this.navCtrl.push(ReportAccidentPage, { 'accident': this.accidents[index] });
  }

  goToHome() {
    this.navCtrl.popToRoot();
  }

  showError = (message) => {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    })
    alert.present();
  }


}
