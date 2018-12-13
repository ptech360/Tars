import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  driverFormGroup:FormGroup;
  vehicleForm: FormGroup;
  cameraOptions: CameraOptions = {
    sourceType         : this.camera.PictureSourceType.CAMERA,
    destinationType    : this.camera.DestinationType.DATA_URL,
    encodingType       : this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,public fb:FormBuilder, public accSev: AccidentProvider, public camera: Camera, public viewCtrl: ViewController) {
    this.driverFormGroup = this.getDriver();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvolvedDriverPage');
    this.vehicleForm = <FormGroup>this.navParams.get('vehicleForm');
  }

  getDriver(){
    return this.fb.group({
      name:['',[Validators.required]],
      age:['',[Validators.required]],
      underInfluence:[false,[Validators.required]],
      gender:['',[Validators.required]],
      drivingLicence:['',[Validators.required]],
      address:['',[Validators.required]],
      pictures:this.fb.array([])
    });
  }

  private captureDriver(driverForm: FormGroup){
    this.camera.getPicture(this.cameraOptions).then((onSuccess)=>{
      const driverImages = <FormArray>driverForm.controls['pictures'];  
      const fileName:string = 'driver-img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg';       
      let file = this.fb.group({
        name:fileName,
        url:'data:image/jpeg;base64,' + onSuccess
      });
      driverImages.push(file);      
    },(onError)=>{
      alert(onError);
    })
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  delDriverImage(driverForm: FormGroup,index:number){
    const driverImages = <FormArray>driverForm.controls['pictures'];
    driverImages.removeAt(index);
  }

  saveDriver(){
    this.vehicleForm.addControl('driver',this.driverFormGroup);
    this.vehicleForm.controls['visibleDriver'].patchValue(false);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
