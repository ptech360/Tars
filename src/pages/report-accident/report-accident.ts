import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
// import { VideoPlayer } from '@ionic-native/video-player';
// import { CaptureVideoOptions, CaptureError, MediaCapture, CaptureImageOptions, MediaFile} from 
// '@ionic-native/media-capture';
/**
 * Generated class for the ReportAccidentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report-accident',
  templateUrl: 'report-accident.html',
})
export class ReportAccidentPage implements OnInit {
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
  accidentTypes = [];
  accidentImageUrls = [];
  files: any = [];
  latitude: number;
  longitude: number;
  location: string;
  mediaFiles: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public accSev: AccidentProvider,
    public toastSev: ToastProvider,
    public camera: Camera,
    public httpClient: HttpClient,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    public alertCtrl: AlertController
    // private mediaCapture: MediaCapture,
    // private videoPlayer: VideoPlayer
  ) {
    this.accidentForm = this.getAccidentForm();
  }

  ngOnInit() {

  }

  getGeoLoacation() {
    this.httpClient.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.latitude + ',' + this.longitude + '&key=AIzaSyC0fj5LBatMHxv2d-o6OTni7V1voRbQiKM').subscribe((response: any) => {
      console.log(response);
      this.location = response.results ? response.results[0].formatted_address : 'Not Locate';
    })
  }

  ionViewDidLoad() {
    this.accSev.getAccidentTypes().subscribe(response => {
      this.accidentTypes = response;
    });
    this.geolocation.getCurrentPosition().then(pos => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      setTimeout(() => {
        this.getGeoLoacation();
      }, 2000);
    }).catch(error => {
      console.log(error);
    });
  }

  getAccidentForm() {
    return this.fb.group({
      accidentInitiate: ['',[Validators.required]],
      accidentPics: this.fb.array([]),
      accidentType: ['',[Validators.required]],
      analysingInfo: ['',[Validators.required]],
      createdBy: [],
      description: ['',[Validators.required]],
      drawing: [],
      fatal: [false,[Validators.required]],
      numOfCasualities: [0,[Validators.required]],
      numOfVehicle: [],
      vehicle: this.fb.array([]),
      otherPerson: this.fb.array([]),
      primaryAndSecondaryCauses: [],
      remark: [],
      visibleVehicles: [true],
      visibleOtherPeople: [true],
      location:[]
    });
  }

  addVehicle() {
    const modal = this.modalCtrl.create('InvolvedVehiclePage', { vehicle: this.accidentForm.controls['vehicle'] });
    modal.present();
  }


  removeVehicle(index: number) {
    const vehicle = <FormArray>this.accidentForm.controls['vehicle'];
    vehicle.removeAt(index);
  }

  addDriver(vehicleForm: FormGroup) {
    const modal = this.modalCtrl.create('InvolvedDriverPage', { vehicleForm: vehicleForm });
    modal.present();
  }

  addPassenger(vehicleForm: FormGroup) {
    const modal = this.modalCtrl.create('InvolvedPassengerPage', { vehicleForm: vehicleForm });
    modal.present();
  }

  removePassenger(vehicleForm: FormGroup, index: number) {
    const person = <FormArray>vehicleForm.controls['person'];
    person.removeAt(index);
  }

  addOtherPeople(accidentForm: FormGroup) {
    const modal = this.modalCtrl.create('InvolvedOtherPeoplePage', { accidentForm: accidentForm });
    modal.present();
  }

  removeOtherPeople(accidentForm: FormGroup, index: number) {
    const otherPerson = <FormArray>accidentForm.controls['otherPerson'];
    otherPerson.removeAt(index);
  }

  private captureVehicle(vehicleForm: FormGroup) {
    this.camera.getPicture(this.cameraOptions).then((onSuccess) => {
      const vehiclePics = <FormArray>vehicleForm.controls['vehiclePics'];
      const fileName: string = 'vehicle-img' + new Date().toISOString().substring(0, 10) + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
      let file = this.fb.group({
        name: fileName,
        url: 'data:image/jpeg;base64,' + onSuccess
      });
      vehiclePics.push(file);
    }, (onError) => {
      alert(onError);
    })
  }

  delVehicleImage(vehicleForm: FormGroup, index: number) {
    const vehiclePics = <FormArray>vehicleForm.controls['vehiclePics'];
    vehiclePics.removeAt(index);
  }

  private captureIncident(accidentForm: FormGroup) {
    this.camera.getPicture(this.cameraOptions).then((onSuccess) => {
      
      const accidentPics = <FormArray>accidentForm.controls['accidentPics'];
      const fileName: string = 'img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg'; 
      let file = this.fb.group({
        name: fileName,
        url: 'data:image/jpeg;base64,' + onSuccess
      });
      console.log(onSuccess);
      
      this.accidentImageUrls.push(file);
      accidentPics.push(new FormControl(this.dataURLtoFile('data:image/jpeg;base64,' + onSuccess,fileName))); 
      console.log(this.dataURLtoFile('data:image/jpeg;base64,' + onSuccess,fileName));
           
    }, (onError) => {
      alert(onError);
    });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  delIncidentImage(accidentForm: FormGroup, index: number) {
    const accidentPics = <FormArray>accidentForm.controls['accidentPics'];
    accidentPics.removeAt(index);
    this.accidentImageUrls.splice(index,1);
  }

  saveAccidentReport() {
    this.accidentForm.controls.location.patchValue(this.location);
    this.toastSev.showLoader();
    const accidentForm = this.accidentForm.value;
    delete accidentForm['visibleVehicles'];
    delete accidentForm['visibleOtherPeople'];
    delete accidentForm.vehicle.visiblePassengers;
    delete accidentForm.vehicle.visibleDriver;
    const formData = this.convertModelToFormData(accidentForm, new FormData(), '');
    this.accSev.addAccidentReport(formData).subscribe(response => {
      this.toastSev.hideLoader();
      this.toastSev.showToast('Accident Reported Successfully');
      this.navCtrl.popToRoot();
    }, error => {
      this.showError(error.message);
      this.toastSev.hideLoader();
    })
  }

  showError = (message) =>{
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    })
    alert.present();
  }

  convertModelToFormData(model: any, form: FormData = null, namespace = ''): FormData {
    let formData = form || new FormData();
    for (let propertyName in model) {
      if (!model.hasOwnProperty(propertyName) || model[propertyName] == undefined) continue;
      let formKey = namespace ? `${namespace}.${propertyName}` : propertyName;
      if (model[propertyName] instanceof Array) {
        model[propertyName].forEach((element, index) => {
          if (typeof element != 'object'){
            formData.append(`${formKey}[${index}]`, element);
          } else if(element instanceof File){   
            const file: File = element;    
            formData.append(`${formKey}[${index}]`, file);
          }else {
            const tempFormKey= `${formKey}[${index}]`;
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

  // private captureVideo() {
  //   let options: CaptureVideoOptions = {
  //     limit: 1,
  //     duration: 30
  //   }
  //   this.mediaCapture.captureVideo(options).then((res: any[]) => {
  //     this.storeMediaFiles(res[0]);
  //   }, (err: CaptureError) => console.error(err));
  // }

  // play(file: any) {
  //   this.videoPlayer.play(file.localURL);
  // }


  storeMediaFiles(file) {
    if (this.mediaFiles.length) {
      this.mediaFiles.push(file);
    } else {
      this.mediaFiles = [];
      this.mediaFiles.push(file);
    }
  }
}
