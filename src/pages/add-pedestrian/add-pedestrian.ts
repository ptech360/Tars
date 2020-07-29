import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';

/**
 * Generated class for the AddPedestrianPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-pedestrian',
  templateUrl: 'add-pedestrian.html',
})
export class AddPedestrianPage {

  pedestrainForm: FormGroup;
  accidentForm: FormGroup;
  index: number = 0;
  pedestrianImageUrls = [];
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
    public accSev: AccidentProvider,
    public camera: Camera,
    public modalCtrl: ModalController,
    private accService: AccidentProvider,
    public toastSev: ToastProvider,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController) {
    this.getPedestrianForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPedestrianPage');
    console.log(this.navParams.get('accident'));
    this.accidentForm = <FormGroup>this.navParams.get('accident');
    if (this.accidentForm['index']) {
      this.index = this.accidentForm['index'];
    }
  }

  getPedestrianForm() {
    this.pedestrainForm = this.fb.group({
      id: [null],
      name: [, [Validators.required]],
      age: [, [Validators.required]],
      address: [, [Validators.required]],
      gender: [, [Validators.required]],
      typeAndExtendOfHumanFactor: [null],
      natureOfAnyInjuries: [null],
      dataOnSocioEconomicStatus: [null],
      underInfluence: [false, [Validators.required]],
      medias: this.fb.array([]),
      type: ["Pedestrian", [Validators.required]],
    });

  }

  savePedestrian() {
    console.log(this.pedestrainForm.value);
    const pedestrian = <FormArray>this.accidentForm['pedestrians'];
    pedestrian.push(this.pedestrainForm.value);
    // this.viewCtrl.dismiss({ accident: this.accidentForm });
    this.toastSev.showLoader();
    // this.accidentForm['index'] = this.index;
    const formData = this.convertModelToFormData(this.pedestrainForm.value, new FormData(), '');
    this.accService.addPedestrian(this.accidentForm['id'], formData).subscribe(response => {
      this.toastSev.hideLoader();
      console.log(response);
      // this.accidentForm['index']++;
      this.toastSev.showToast('Pedestrain Added !');
      this.viewCtrl.dismiss({ accident: this.accidentForm });
      // this.navCtrl.push(AddPedestrianPage, { accident: this.accidentForm });
    },(error=>{
      this.toastSev.hideLoader();
    }))
  }

  // submitPedestrian() {
  //   this.toastSev.showLoader();
  //   const formData = this.convertModelToFormData(this.pedestrainForm.value, new FormData(), '');
  //   this.accService.addPedestrian(this.accidentForm['id'], formData).subscribe(response => {
  //     this.toastSev.hideLoader();
  //     console.log(response);
  //     this.toastSev.showToast('Accident Saved Successfully !');
  //     this.navCtrl.popToRoot();
  //   }, (error => {
  //     console.log(error);
  //     this.toastSev.hideLoader();
  //   }))
  // }

  private capturePassenger(personForm: FormGroup) {
    this.camera.getPicture(this.cameraOptions).then((onSuccess) => {
      const personImages = <FormArray>this.pedestrainForm.controls['medias'];
      const fileName: string = 'person-img' + new Date().toISOString().substring(0, 10) + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
      let file = this.fb.group({
        name: fileName,
        url: 'data:image/jpeg;base64,' + onSuccess
      });
      personImages.push(new FormControl(this.dataURLtoFile('data:image/jpeg;base64,' + onSuccess, fileName)));
      this.pedestrianImageUrls.push(file);
    }, (onError) => {
      alert(onError);
    });
  }

  delPedestrianImage(personForm: FormGroup, index: number) {
    const personImages = <FormArray>this.pedestrainForm.controls['medias'];
    personImages.removeAt(index);
    this.pedestrianImageUrls.splice(index, 1);
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  convertModelToFormData(model: any, form: FormData = null, namespace = ''): FormData {
    let formData = form || new FormData();
    for (let propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || model[propertyName] == undefined) continue;
      let formKey = namespace ? `${namespace}.${propertyName}` : propertyName;
      if (model[propertyName] instanceof Array) {
        model[propertyName].forEach((element, index) => {
          if (typeof element != 'object') {
            formData.append(`${formKey}[${index}]`, element);
          } else if (element instanceof File) {
            const file: File = element;
            formData.append(`${formKey}[${index}]`, file);
          } else {
            const tempFormKey = `${formKey}[${index}]`;
            this.convertModelToFormData(element, formData, tempFormKey);
          }
        });
      } else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File)) {
        this.convertModelToFormData(model[propertyName], formData, formKey);
      }
      else {
        formData.append(formKey, model[propertyName].toString());
      }
    }
    return formData;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
