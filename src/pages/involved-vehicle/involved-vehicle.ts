import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormArray, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { CameraOptions, Camera } from '@ionic-native/camera';

/**
 * Generated class for the InvolvedVehiclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-involved-vehicle',
  templateUrl: 'involved-vehicle.html',
})
export class InvolvedVehiclePage {
  vehicleFormGroup: FormGroup;
  vehicle: FormArray;
  vehicleImageUrls = [];
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
    this.vehicleFormGroup = this.getVehicleFormGroup();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvolvedVehiclePage');
    this.vehicle = <FormArray>this.navParams.get('vehicle');
  }

  getVehicleFormGroup() {
    return this.fb.group({
      number: ['', [Validators.required]],
      model: ['', [Validators.required]],
      vehiclePics: this.fb.array([]),
      visibleDriver: [true],
      visiblePassengers: [true],
      person: this.fb.array([]),
    });
  }

  saveVehicle() {
    this.vehicle.push(this.vehicleFormGroup);
    this.dismiss();
  }

  private captureVehicle(vehicleForm: FormGroup) {
    this.camera.getPicture(this.cameraOptions).then((onSuccess) => {
      console.log(onSuccess);
      const vehiclePics = <FormArray>vehicleForm.controls['vehiclePics'];
      const fileName: string = 'vehicle-img' + new Date().toISOString().substring(0, 10) + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
      let file = this.fb.group({
        name: fileName,
        url: 'data:image/jpeg;base64,' + onSuccess
      });
      this.vehicleImageUrls.push(file);
      vehiclePics.push(new FormControl(this.dataURLtoFile('data:image/jpeg;base64,' +onSuccess, fileName)));
    }, (onError) => {
      alert(onError);
    })
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  delVehicleImage(vehicleForm: FormGroup, index: number) {
    const vehiclePics = <FormArray>vehicleForm.controls['vehiclePics'];
    vehiclePics.removeAt(index);
    this.vehicleImageUrls.splice(index,1);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
