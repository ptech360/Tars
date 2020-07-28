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

@IonicPage()
@Component({
  selector: 'page-add-person',
  templateUrl: 'add-person.html',
})
export class AddPersonPage {
  personForm: FormGroup;
  personImageUrls: any = [];
  personTypes = [];
  persons: FormArray;
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
    this.accService.getPersonTypes().subscribe(res => {
      this.personTypes = res;
    });
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
      type: [, [Validators.required]],
    });
  }

  savePerson() {
    console.log(this.personForm.value);
    this.persons.push(this.personForm);
    this.dismiss();
  }

  private capturePassenger(personForm: FormGroup) {
    this.camera.getPicture(this.cameraOptions).then((onSuccess) => {
      const personImages = <FormArray>personForm.controls['medias'];
      const fileName: string = 'person-img' + new Date().toISOString().substring(0, 10) + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
      let file = this.fb.group({
        name: fileName,
        url: 'data:image/jpeg;base64,' + onSuccess
      });
      personImages.push(new FormControl(this.dataURLtoFile('data:image/jpeg;base64,' + onSuccess, fileName)));
      this.personImageUrls.push(file);
    }, (onError) => {
      alert(onError);
    });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  delPassengerImage(personForm: FormGroup, index: number) {
    const personImages = <FormArray>personForm.controls['medias'];
    personImages.removeAt(index);
    this.personImageUrls.splice(index, 1);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
