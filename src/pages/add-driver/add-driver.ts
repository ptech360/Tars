import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AccidentProvider } from '../../providers/accident/accident';

/**
 * Generated class for the AddDriverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-driver',
  templateUrl: 'add-driver.html',
})
export class AddDriverPage {
  driverForm: FormGroup;
  driverImageUrls: any = [];
  driver: FormArray;
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
    this.getDriver();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDriverPage');
    this.driver = <FormArray>this.navParams.get('persons')
    console.log(this.navParams.get('persons'));
  }

  getDriver(){
    this.driverForm = this.fb.group({
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
      type: ["Driver", [Validators.required]],
    });
  }

  saveDriver() {
    console.log(this.driverForm.value);
    this.driver.push(this.driverForm);
    this.dismiss();
  }

  private captureDriver(driverForm: FormGroup) {
    this.camera.getPicture(this.cameraOptions).then((onSuccess) => {
      const personImages = <FormArray>driverForm.controls['medias'];
      const fileName: string = 'person-img' + new Date().toISOString().substring(0, 10) + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
      let file = this.fb.group({
        name: fileName,
        url: 'data:image/jpeg;base64,' + onSuccess
      });
      personImages.push(new FormControl(this.dataURLtoFile('data:image/jpeg;base64,' + onSuccess, fileName)));
      this.driverImageUrls.push(file);
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

  delDriverImage(personForm: FormGroup, index: number) {
    const driverImages = <FormArray>personForm.controls['medias'];
    driverImages.removeAt(index);
    this.driverImageUrls.splice(index, 1);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
