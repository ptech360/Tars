import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AccidentProvider } from '../../providers/accident/accident';

/**
 * Generated class for the AddPersonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-person',
  templateUrl: 'add-person.html',
})
export class AddPersonPage {
  personForm: FormGroup;
  personImageUrls: any = [];
  personTypes = [];
  persons: FormArray;
  index: number;
  cameraOptions: CameraOptions = {
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetWidth: 600,
    targetHeight: 600,
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public camera: Camera,
    public viewCtrl: ViewController,
    private accService: AccidentProvider) {
    this.getPassenger();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPersonPage');
    this.persons = <FormArray>this.navParams.get('persons')
    console.log(this.navParams.get('persons'));
    this.index = this.navParams.get('index');
    console.log("index - ", this.index);
    if (this.index) {
      const editPersonObj = this.persons.controls[this.index];
      console.log(editPersonObj);
      Object.keys(editPersonObj.value).forEach(key => {
        if (editPersonObj.value[key]) {
          this.personForm.controls[key].patchValue(editPersonObj.value[key]);
        }
      });
    }

  }

  getPassenger() {
    this.personForm = this.fb.group({
      id: [null],
      name: [, [Validators.required]],
      licence: [null],
      age: [, [Validators.required]],
      address: [, [Validators.required]],
      gender: [, [Validators.required]],
      typeAndExtendOfHumanFactor: [null],
      natureOfAnyInjuries: [null],
      dataOnSocioEconomicStatus: [null],
      underInfluence: [false, [Validators.required]],
      medias: this.fb.array([]),
      type: ["Passenger", [Validators.required]],
    });
  }

  savePerson() {
    if (this.index) {
      this.persons.removeAt(this.index);
      this.persons.insert(this.index, this.personForm);
      this.dismiss()
      this.index = 0;
    }
    else {
      console.log(this.personForm.value);
      this.persons.push(this.personForm);
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
