import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
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

  accidentForm:FormGroup;
  accidentTypes = [];
  cameraOptions: CameraOptions = {
    sourceType         : this.camera.PictureSourceType.CAMERA,
    destinationType    : this.camera.DestinationType.DATA_URL,
    encodingType       : this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };
  vehicleImageUrls: any = [];
  files: any = [];
  latitude: number;
  longitude: number;
  location: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public fb:FormBuilder, 
              public accSev: AccidentProvider,
              public toastSev:ToastProvider,
              public camera: Camera,
              private geolocation: Geolocation,
              public httpClient: HttpClient,
              public modalCtrl:ModalController
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
      noOfVehicle: [0,[Validators.required]],
      involvedVehicles: this.fb.array([]),
      visibleVehicles: [true],
      otherPeopleInvolved: this.fb.array([]),
      visibleOtherPeople:[true],
      incidentPhotos:this.fb.array([]),
      incidentDescription:['',[Validators.required]],
      remarks:['',[Validators.required]]
    });
  }

  getVehicleFormGroup(){
    return this.fb.group({
      vehicleNumber: ['',[Validators.required]],
      vehicleModel: ['',[Validators.required]],
      vehicleImages: this.fb.array([]),
      // driver:[''],
      visibleDriver:[true],
      visiblePassengers:[true],
      passengers:this.fb.array([]),
    });
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

  getPassenger(){
    return this.fb.group({
      name:['',[Validators.required]],
      age:['',[Validators.required]],
      underInfluence:[false,[Validators.required]],
      gender:['',[Validators.required]],
      drivingLicence:[''],
      address:['',[Validators.required]],
      pictures:this.fb.array([])
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
      pictures:this.fb.array([])
    });
  }

  addVehicle(){    
  const modal =  this.modalCtrl.create('InvolvedVehiclePage', {involvedVehicles: this.accidentForm.controls['involvedVehicles']});
  modal.present();
  // const involvedVehicles = <FormArray>this.accidentForm.controls['involvedVehicles'];
  // involvedVehicles.push(this.getVehicleFormGroup());
  }

  
  removeVehicle(index: number){
    const involvedVehicles = <FormArray>this.accidentForm.controls['involvedVehicles'];
    involvedVehicles.removeAt(index);    
  }

  addDriver(vehicleForm: FormGroup){
    const modal =  this.modalCtrl.create('InvolvedDriverPage', {vehicleForm: vehicleForm});
    modal.present();
    // vehicleForm.addControl('driver',this.getDriver());
  }
  
  addPassenger(vehicleForm: FormGroup){
    const modal =  this.modalCtrl.create('InvolvedPassengerPage', {vehicleForm: vehicleForm});
    modal.present();
    // const passengers = <FormArray>vehicleForm.controls['passengers'];
    // passengers.push(this.getPassenger());
  }

  removePassenger(vehicleForm: FormGroup, index:number){
    const passengers = <FormArray>vehicleForm.controls['passengers'];
    passengers.removeAt(index);
  }

  addOtherPeople(accidentForm: FormGroup){
    const modal =  this.modalCtrl.create('InvolvedOtherPeoplePage', {accidentForm: accidentForm});
    modal.present();
    // const otherPeopleInvolved = <FormArray>accidentForm.controls['otherPeopleInvolved'];
    // otherPeopleInvolved.push(this.getOtherPeopleForm());
  }
  
  removeOtherPeople(accidentForm: FormGroup, index:number){
    const otherPeopleInvolved = <FormArray>accidentForm.controls['otherPeopleInvolved'];
    otherPeopleInvolved.removeAt(index);
  }

  private captureVehicle(vehicleForm: FormGroup){
    this.camera.getPicture(this.cameraOptions).then((onSuccess)=>{
      const vehicleImages = <FormArray>vehicleForm.controls['vehicleImages'];  
      const fileName:string = 'vehicle-img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg';       
      let file = this.fb.group({
        name:fileName,
        url:'data:image/jpeg;base64,' + onSuccess
      });
      vehicleImages.push(file);      
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

  delVehicleImage(vehicleForm: FormGroup,index:number){
    const vehicleImages = <FormArray>vehicleForm.controls['vehicleImages'];
    vehicleImages.removeAt(index);
    // this.vehicleImageUrls.splice(index,1);
    // this.files.splice(index,1);
  }

  private captureIncident(accidentForm: FormGroup){
    this.camera.getPicture(this.cameraOptions).then((onSuccess)=>{
      const incidentPhotos = <FormArray>accidentForm.controls['incidentPhotos'];  
      const fileName:string = 'incident-img'+new Date().toISOString().substring(0,10)+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.jpeg';       
      let file = this.fb.group({
        name:fileName,
        url:'data:image/jpeg;base64,' + onSuccess
      });      
      incidentPhotos.push(file);      
    },(onError)=>{
      alert(onError);
    })
  }

  delIncidentImage(accidentForm: FormGroup,index:number){
    const incidentPhotos = <FormArray>accidentForm.controls['incidentPhotos'];
    incidentPhotos.removeAt(index);
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
}
