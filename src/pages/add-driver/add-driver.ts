import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AccidentProvider } from '../../providers/accident/accident';
import { MediaComponent } from '../../components/media/media';

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
  @ViewChild('media') media: MediaComponent;
  vehicle: any = {};
  ediPersonObject: any;
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
    this.driver = <FormArray>this.navParams.get('vehicle').controls['persons'];
    this.index = this.navParams.get('index');
    this.vehicle = this.navParams.get('vehicle').value;
    console.log(this.navParams.get('vehicle'));
  }

  patchDriver() {
    if (this.index == 0) {
      this.ediPersonObject = this.driver.controls[this.index].value;
      const editPersonObj: any = this.driver.controls[this.index];
      console.log(editPersonObj);
      Object.keys(editPersonObj.value).forEach(key => {
        if (key != 'medias' && editPersonObj.value[key] && this.driverForm.controls[key]) {
          this.driverForm.controls[key].patchValue(editPersonObj.value[key]);
        }
      });
      setTimeout(() => {
        this.media.setMedias(editPersonObj.value.medias);
      }, 500);
    }
  }

  ionViewWillEnter() {
    this.patchDriver();

    this.media.setMediaFor(`vehicle${this.vehicle.vehicleCounter}-driver`)
    this.media.createDirectory();
    this.media.loadAndPatchFiles();
    // this.viewCtrl.onDidDismiss(() => {
    //   this.media.clearDirectory();
    // })
  }

  getDriver() {
    this.driverForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      sequence: [0],
      licence: [null, [Validators.required]],
      age: ['', [Validators.required]],
      address: ['', [Validators.required]],
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
