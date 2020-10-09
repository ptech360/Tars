import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Navbar, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { InvolvedVehiclePage } from '../involved-vehicle/involved-vehicle';
import { AddVehiclePage } from '../add-vehicle/add-vehicle';
import { MediaComponent } from '../../components/media/media';
declare let VanillaFile: any;

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
export class ReportAccidentPage implements OnInit, OnDestroy {
  accidentGlobalObject: any = {};
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('media') media: MediaComponent;
  accidentForm: FormGroup;
  accidentTypes = [];
  // accidentInitiates = [];
  accidentImageUrls = [];
  files: any = [];
  latitude: number;
  longitude: number;
  location: string;
  mediaFiles: any = [];
  accidentObject = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public accSev: AccidentProvider,
    public toastSev: ToastProvider,
    public camera: Camera,
    public httpClient: HttpClient,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public platform: Platform
  ) {
    this.accidentForm = this.getAccidentForm();
  }

  ionViewWillEnter() {
    if (this.accidentGlobalObject.medias) {
      setTimeout(() => {
        this.media.setMedias(this.accidentGlobalObject.medias);
      }, 1000);
    }
    this.accidentGlobalObject.vehicleCounter = 0;
    this.media.setMediaFor('accident')
    this.media.createDirectory();
    this.media.clearFiles();
  }

  ngOnInit() {

  }

  patchAccident() {
    const accident = this.navParams.get('accident');
    Object.keys(accident).forEach(key => {
      if (this.accidentForm.controls[key]) {
        this.accidentForm.controls[key].patchValue(accident[key]);
      }
    })
  }

  getGeoLoacation() {
    this.toastSev.showLoader('Getting current location');
    this.httpClient.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.latitude + ',' + this.longitude + '&key=AIzaSyCaNwEauxusdcGJMGNvzcRdCSVo9zBWt-M').subscribe((response: any) => {
      this.toastSev.hideLoader();
      this.location = response.results ? response.results[0].formatted_address : 'Not Locate';
      this.accidentForm.controls.address.patchValue(this.location);
    })
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      // todo something
      this.navCtrl.pop();
    }
    if (this.navParams.get('accident')) {
      this.accidentGlobalObject = this.navParams.get('accident');
      this.accidentGlobalObject.vehicleCounter = 0;
      this.patchAccident();
    }
    this.accSev.getAccidentTypes().subscribe(response => {
      this.accidentTypes = response;
    });
    this.geolocation.getCurrentPosition().then(pos => {
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      this.accidentForm.controls.latitude.patchValue(this.latitude);
      this.accidentForm.controls.longitude.patchValue(this.longitude);
      setTimeout(() => {
        if (!this.accidentForm.controls.address.value) {
          this.getGeoLoacation();
        }
      }, 1000);
    }).catch(error => {
      this.showError(error.message);
    });
  }

  getAccidentForm() {
    return this.fb.group({
      id: [],
      firNum: [],
      fatal: [false, [Validators.required]],
      numOfCasualities: [1, [Validators.required]],
      description: ['', [Validators.required]],
      numOfVehicle: [0, [Validators.required]],
      typeAndExtent: [''],
      remark: ['', [Validators.required]],
      medias: this.fb.array([]),
      type: ['', [Validators.required]],
      primaryAndSecondaryCauses: [''],
      drawing: [''],
      analysingInfo: ['', [Validators.required]],
      longitude: [''],
      latitude: [''],
      address: ['', [Validators.required]]
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

  saveAccidentReport() {
    if (this.accidentObject['id']) {
      this.accidentForm.controls.id.patchValue(this.accidentObject['id']);
    }

    this.toastSev.showLoader();
    console.log(this.accidentForm.value);
    const accidentForm = this.accidentForm.value;
    const formData = new FormData();
    Object.keys(this.accidentForm.value).forEach(key => {
      if (key == 'medias') {
        if (typeof (this.accidentForm.value[key]) == 'object') {
          this.accidentForm.value.medias.forEach((element, index) => {
            if (element instanceof VanillaFile) {
              formData.append(key + '[' + index + '].media', element);
            } else {
              formData.append(key + '[' + index + '].id', element.id);
            }
          });
        }
      }
      else {
        formData.append(key, this.accidentForm.value[key])
      }
    });

    if (this.accidentForm.value.id) {
      this.accSev.editAccidentReport(this.accidentForm.value.id, formData).subscribe(response => {
        this.ngOnDestroy();
        this.accidentObject = response;
        this.toastSev.hideLoader();
        this.toastSev.showToast('Accident Updated !');
        this.accidentGlobalObject = response;
        this.accidentGlobalObject.vehicleCounter = 0;
        this.navCtrl.push(AddVehiclePage, { accident: this.accidentGlobalObject });
      }, error => {
        this.showError(error.message);
        this.toastSev.hideLoader();
      });
    } else {
      this.accSev.addAccidentReport(formData).subscribe(response => {
        this.ngOnDestroy();
        this.accidentObject = response;
        this.toastSev.hideLoader();
        this.toastSev.showToast('Accident Report Initiated !');
        this.accidentGlobalObject = response;
        this.accidentGlobalObject.vehicleCounter = 0;
        this.navCtrl.push(AddVehiclePage, { accident: this.accidentGlobalObject });
      }, error => {
        this.showError(error.message);
        this.toastSev.hideLoader();
      });
    }
  }

  showError = (message) => {
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

  goToHome() {
    this.navCtrl.popToRoot();
  }

  ngOnDestroy() {
    this.media.clearDirectory();
  }

}
