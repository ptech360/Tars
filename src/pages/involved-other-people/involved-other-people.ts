import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AccidentProvider } from '../../providers/accident/accident';

/**
 * Generated class for the InvolvedOtherPeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-involved-other-people',
  templateUrl: 'involved-other-people.html',
})
export class InvolvedOtherPeoplePage {
  otherPeopleFormGroup:FormGroup;
  cameraOptions: CameraOptions = {
    sourceType         : this.camera.PictureSourceType.CAMERA,
    destinationType    : this.camera.DestinationType.DATA_URL,
    encodingType       : this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetWidth: 600,
    targetHeight: 600,
  };
  accidentForm: FormGroup;
  otherPeopleImageUrls: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public fb:FormBuilder, public accSev: AccidentProvider, public camera: Camera, public viewCtrl: ViewController) {
    this.otherPeopleFormGroup = this.getOtherPeopleForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvolvedOtherPeoplePage');
    this.accidentForm = <FormGroup>this.navParams.get('accidentForm');
  }

  getOtherPeopleForm(){
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
      personType: ['other']
    });
  }


  private capturePeople(otherPeople: FormGroup){
    this.camera.getPicture(this.cameraOptions).then((onSuccess)=>{
      const otherPeopleImages = <FormArray>otherPeople.controls['personPics'];  
      const fileName:string = 'person-img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg';       
      let file = this.fb.group({
        name:fileName,
        url:'data:image/jpeg;base64,' + onSuccess
      });
      otherPeopleImages.push(new FormControl(this.dataURLtoFile('data:image/jpeg;base64,' +onSuccess,fileName))); 
      this.otherPeopleImageUrls.push(file);     
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

  delPeopleImage(otherPeople: FormGroup,index:number){
    const otherPeopleImages = <FormArray>otherPeople.controls['personPics'];
    otherPeopleImages.removeAt(index);
    this.otherPeopleImageUrls.splice(index,1);
  }

  savePeople(){
    this.accidentForm.controls['visibleOtherPeople'].patchValue(false);
    this.accidentForm.controls['visibleVehicles'].patchValue(false);    
    const otherPerson = <FormArray>this.accidentForm.controls['otherPerson'];
    otherPerson.push(this.otherPeopleFormGroup);
    console.log(this.accidentForm.value);
    
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
