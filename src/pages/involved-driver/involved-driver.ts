import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the InvolvedDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-involved-driver',
  templateUrl: 'involved-driver.html',
})
export class InvolvedDriverPage {
  driverFormGroup: FormGroup;
  vehicleForm: FormGroup;
  driverImageUrls = [];
  cameraOptions: CameraOptions = {
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetWidth: 600,
    targetHeight: 600,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, public accSev: AccidentProvider, public camera: Camera, public viewCtrl: ViewController) {
    this.driverFormGroup = this.getDriver();
  }

  ionViewDidLoad() {
    this.vehicleForm = <FormGroup>this.navParams.get('vehicleForm');
  }

  getDriver() {
    return this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      underInfluence: [false, [Validators.required]],
      gender: ['', [Validators.required]],
      licence: ['', [Validators.required]],
      address: ['', [Validators.required]],
      typeAndExtentOfHumanFactor: [''],
      natureOfAnyInjuries: [''],
      dataOnSocioEconomicStatus: [''],
      personPics: this.fb.array([]),
      personType: ['driver']
    });
  }

  saveDriver() {
    // this.vehicleForm.addControl('person', this.driverFormGroup);
    this.vehicleForm.controls['visibleDriver'].patchValue(false);
    const person = <FormArray>this.vehicleForm.controls['person'];
    person.push(this.driverFormGroup);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
