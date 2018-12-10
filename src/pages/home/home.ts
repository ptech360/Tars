import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ReportAccidentPage } from '../report-accident/report-accident';
import { ViewAccidentsPage } from '../view-accidents/view-accidents';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  reportAccident(){
    this.navCtrl.push(ReportAccidentPage);
  }

  viewAccidents(){
    this.navCtrl.push(ViewAccidentsPage);
  }

}
