import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { Camera } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { AddPedestrianPage } from '../add-pedestrian/add-pedestrian';

/**
 * Generated class for the SubmitAccidentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-submit-accident',
  templateUrl: 'submit-accident.html',
})
export class SubmitAccidentPage {

  accidentForm: FormGroup;

  constructor(public navParams: NavParams,
    public fb: FormBuilder,
    public accSev: AccidentProvider,
    public camera: Camera,
    public modalCtrl: ModalController,
    private accService: AccidentProvider,
    public toastSev: ToastProvider,
    public alertCtrl: AlertController,
    private navCtrl: NavController) {
    this.accidentForm = <FormGroup>this.navParams.get('accident');
    console.log(this.accidentForm);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmitAccidentPage');
    // this.accidentForm = <FormGroup>this.navParams.get('accident');
  }

  addPedestrian() {
    if (!this.accidentForm['pedestrians']) {
      this.accidentForm['pedestrians'] = [];
    }
    const modal = this.modalCtrl.create(AddPedestrianPage, { accident: this.accidentForm })
    modal.present();
  }

  editPedestrian(index) {
    const modal = this.modalCtrl.create(AddPedestrianPage, { accident: this.accidentForm, index: index })
    modal.present();
  }

  removePedestrian(index) {
    const pedestrian = this.accidentForm['pedestrians'];
    const pedId = this.accidentForm['pedestrians'][index]['id'];
    // this.toastSev.showLoader();
    // pedestrian.splice(index,1);
    this.accService.deletePedestrian(this.accidentForm['id'], pedId).subscribe(response => {
      this.toastSev.hideLoader();
      pedestrian.splice(index, 1);
      console.log(response);
    }, (error => {
      this.toastSev.hideLoader();
      console.log(error);
    }));
  }

  submitAccident() {
    this.toastSev.showLoader();
    this.accService.submitAccident(this.accidentForm['id']).subscribe(response => {
      this.toastSev.showToast('Accident Reported Successfully !');
      console.log(response);
      this.toastSev.hideLoader();
      this.navCtrl.popToRoot();
    }, (error => {
      console.log(error);
      this.toastSev.hideLoader();
    }))
  }

}
