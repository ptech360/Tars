import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AccidentProvider } from '../../providers/accident/accident';

/**
 * Generated class for the AddDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-add-driver',
  templateUrl: 'add-driver.html',
})
export class AddDriverPage {
  driverForm: FormGroup;
  driverImageUrls: any = [];
  driver: FormArray;
  index: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public camera: Camera,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private accService: AccidentProvider) {
    this.getDriver();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDriverPage');
    this.driver = <FormArray>this.navParams.get('persons')
    this.index = this.navParams.get('index');
    console.log(this.navParams.get('persons'));
    if (this.index == 0) {
      const editPersonObj = this.driver.controls[this.index];
      console.log(editPersonObj);
      Object.keys(editPersonObj.value).forEach(key => {
        if (editPersonObj.value[key]&&this.driverForm.controls[key]) {
          this.driverForm.controls[key].patchValue(editPersonObj.value[key]);
        }
      });
    }

  }

  getDriver() {
    this.driverForm = this.fb.group({
      id: [null],
      name: ['Pankaj', [Validators.required]],
      licence: [null,  [Validators.required]],
      age: [28, [Validators.required]],
      address: ['xyz', [Validators.required]],
      gender: ['', [Validators.required]],
      typeAndExtendOfHumanFactor: [null],
      natureOfAnyInjuries: [null],
      dataOnSocioEconomicStatus: [null],
      underInfluence: [false, [Validators.required]],
      medias: this.fb.array([]),
      type: ["Driver", [Validators.required]],
    });
  }

  saveDriver() {
    if (this.index == 0) {
      this.driver.removeAt(this.index);
      this.driver.insert(0, this.driverForm);
      this.dismiss();
      this.index = 1;
    }
    else {
      console.log(this.driverForm.value);
      this.driver.push(this.driverForm);
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
