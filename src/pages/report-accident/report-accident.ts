import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { Media, MediaObject } from '@ionic-native/media';
import { Storage } from '@ionic/storage';
import { VideoPlayer } from '@ionic-native/video-player';
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
export class ReportAccidentPage implements OnInit{
  cameraOptions: CameraOptions = {
    sourceType         : this.camera.PictureSourceType.CAMERA,
    destinationType    : this.camera.DestinationType.DATA_URL,
    encodingType       : this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };
  accidentForm:FormGroup;
  accidentTypes = [];
  vehicleImageUrls: any = [];
  files: any = [];
  latitude: number;
  longitude: number;
  location: any;
  mediaFiles: any = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public fb:FormBuilder, 
              public accSev: AccidentProvider,
              public toastSev:ToastProvider,
              public camera: Camera,
              public httpClient: HttpClient,
              public modalCtrl:ModalController,
              private geolocation: Geolocation,
              private mediaCapture: MediaCapture,
              private videoPlayer: VideoPlayer
              ) {
    this.accidentForm = this.getAccidentForm();
  }

  ngOnInit(){
    
  }

  getGeoLoacation(){
    this.httpClient.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.latitude+','+this.longitude+'&key=AIzaSyC0fj5LBatMHxv2d-o6OTni7V1voRbQiKM').subscribe((response:any) => {
      console.log(response);
      this.location = response.results ? response.results[0].formatted_address : 'Not Locate';
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportAccidentPage');
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
    }).catch(error=>{
      console.log(error);
    });
  }

  getAccidentForm(){
    return this.fb.group({
      geoLocation:[''],
      dateTime:[new Date()],
      accidentType: ['',[Validators.required]],
      fatal: [false,[Validators.required]],
      numOfVehicle: [0,[Validators.required]],
      numOfCasualities: [0,[Validators.required]],
      accidentInitiate:[''],
      vehicle: this.fb.array([]),
      visibleVehicles: [true],
      otherPerson: this.fb.array([]),
      visibleOtherPeople:[true],
      accidentPics:this.fb.array([]),
      description:['',[Validators.required]],
      remarks:[''],
      primaryAndSecondaryCauses:[''],
      drawing:[''],
      analysingInfo: [''],
      fir:['FIR'+Math.random()]
    });
  }

  getVehicleFormGroup(){
    return this.fb.group({
      number: ['',[Validators.required]],
      model: ['',[Validators.required]],
      vehiclePics: this.fb.array([]),
      // driver:[''],
      visibleDriver:[true],
      visiblePassengers:[true],
      person:this.fb.array([]),
    });
  }

  getDriver(){
    return this.fb.group({
      name:['',[Validators.required]],
      age:['',[Validators.required]],
      underInfluence:[false,[Validators.required]],
      gender:['',[Validators.required]],
      drivingLicence:[''],
      address:['',[Validators.required]],
      typeAndExtentOfHumanFactor:[''],
      natureOfAnyInjuries:[''],
      dataOnSocioEconomicStatus:[''],
      personPics:this.fb.array([])
    });
  }

  getPassenger(){
    return this.fb.group({
      name:['',[Validators.required]],
      age:['',[Validators.required]],
      underInfluence:[false,[Validators.required]],
      gender:['',[Validators.required]],
      drivingLicence:[''],
      address:['',[Validators.required]],      
      personPics:this.fb.array([])
    });
  }

  getOtherPeopleForm(){
    return this.fb.group({
      name:[''],
      age:[''],
      underInfluence:[false],
      gender:[''],
      drivingLicence:[''],
      address:[''],
      typeAndExtentOfHumanFactor:[''],
      natureOfAnyInjuries:[''],
      dataOnSocioEconomicStatus:[''],
      personPics:this.fb.array([])
    });
  }

  addVehicle(){    
  const modal =  this.modalCtrl.create('InvolvedVehiclePage', {vehicle: this.accidentForm.controls['vehicle']});
  modal.present();
  // const vehicle = <FormArray>this.accidentForm.controls['vehicle'];
  // vehicle.push(this.getVehicleFormGroup());
  }

  
  removeVehicle(index: number){
    const vehicle = <FormArray>this.accidentForm.controls['vehicle'];
    vehicle.removeAt(index);    
  }

  addDriver(vehicleForm: FormGroup){
    const modal =  this.modalCtrl.create('InvolvedDriverPage', {vehicleForm: vehicleForm});
    modal.present();
    // vehicleForm.addControl('driver',this.getDriver());
  }
  
  addPassenger(vehicleForm: FormGroup){
    const modal =  this.modalCtrl.create('InvolvedPassengerPage', {vehicleForm: vehicleForm});
    modal.present();
    // const person = <FormArray>vehicleForm.controls['person'];
    // person.push(this.getPassenger());
  }

  removePassenger(vehicleForm: FormGroup, index:number){
    const person = <FormArray>vehicleForm.controls['person'];
    person.removeAt(index);
  }

  addOtherPeople(accidentForm: FormGroup){
    const modal =  this.modalCtrl.create('InvolvedOtherPeoplePage', {accidentForm: accidentForm});
    modal.present();
    // const otherPerson = <FormArray>accidentForm.controls['otherPerson'];
    // otherPerson.push(this.getOtherPeopleForm());
  }
  
  removeOtherPeople(accidentForm: FormGroup, index:number){
    const otherPerson = <FormArray>accidentForm.controls['otherPerson'];
    otherPerson.removeAt(index);
  }

  private captureVehicle(vehicleForm: FormGroup){
    this.camera.getPicture(this.cameraOptions).then((onSuccess)=>{
      const vehiclePics = <FormArray>vehicleForm.controls['vehiclePics'];  
      const fileName:string = 'vehicle-img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg';       
      let file = this.fb.group({
        name:fileName,
        url:'data:image/jpeg;base64,' + onSuccess
      });
      vehiclePics.push(file);      
    },(onError)=>{
      alert(onError);
    })
  }

  // dataURLtoFile(dataurl, filename) {
  //   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  //       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  //   while(n--){
  //       u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, {type:mime});
  // }

  delVehicleImage(vehicleForm: FormGroup,index:number){
    const vehiclePics = <FormArray>vehicleForm.controls['vehiclePics'];
    vehiclePics.removeAt(index);
    // this.vehicleImageUrls.splice(index,1);
    // this.files.splice(index,1);
  }

  private captureIncident(accidentForm: FormGroup){
    this.camera.getPicture(this.cameraOptions).then((onSuccess)=>{
      const accidentPics = <FormArray>accidentForm.controls['accidentPics'];  
      const fileName:string = 'incident-img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg';       
      let file = this.fb.group({
        name:fileName,
        url:'data:image/jpeg;base64,' + onSuccess
      });      
      accidentPics.push(file);      
    },(onError)=>{
      alert(onError);
    })
  }

  delIncidentImage(accidentForm: FormGroup,index:number){
    const accidentPics = <FormArray>accidentForm.controls['accidentPics'];
    accidentPics.removeAt(index);
  }

  saveAccidentReport(){
    this.accidentForm.controls.geoLocation.patchValue(this.location);
    this.toastSev.showLoader();
    this.accSev.addAccidentReport(this.accidentForm.value).subscribe(response => {
      this.toastSev.hideLoader();
      this.toastSev.showToast('Accident Reported Successfully');
      this.navCtrl.popToRoot();
    })
  }

  private captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      this.storeMediaFiles(res[0]);
    },(err: CaptureError) => console.error(err));
  }
 
  play(file:any) {
    this.videoPlayer.play(file.localURL);
  }
 
  storeMediaFiles(file) {
    if(this.mediaFiles.length){
      this.mediaFiles.push(file);
    } else {
      this.mediaFiles = [];
      this.mediaFiles.push(file);      
    }
  }
}
