import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController, AlertController, NavController, Navbar } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { Console } from '@angular/core/src/console';
import { AddPedestrianPage } from '../add-pedestrian/add-pedestrian';
import { SubmitAccidentPage } from '../submit-accident/submit-accident';

@Component({
    selector: 'page-add-vehicle',
    templateUrl: 'add-vehicle.html',
})
export class AddVehiclePage implements OnInit {
    @ViewChild(Navbar) navBar: Navbar;
    vehicleFormGroup: FormGroup;
    public accidentForm: FormGroup;
    vehicleImageUrls = [];
    personTypes = [];
    index: number = 0;
    // vehicles : FormArray; 


    constructor(public navParams: NavParams,
        public fb: FormBuilder,
        public accSev: AccidentProvider,
        public camera: Camera,
        public modalCtrl: ModalController,
        private accService: AccidentProvider,
        public toastSev: ToastProvider,
        public alertCtrl: AlertController,
        private navCtrl: NavController
    ) {
        this.accidentForm = <FormGroup>this.navParams.get('accident');
        console.log("Accident Response - ", this.navParams.get('accident'));

        this.vehicleFormGroup = this.fb.group({
            number: [, [Validators.required]],
            model: [, [Validators.required]],
            medias: this.fb.array([]),
            persons: this.fb.array([], Validators.required),
        })

        if (this.accidentForm['vehicles']) {
            console.log("Contains Vehicle");
            const vehicles = <FormArray>this.accidentForm['vehicles'];
            vehicles.push(this.vehicleFormGroup.value);
            console.log("Index - ", this.accidentForm['index']);
            if (this.accidentForm['index']) {
                this.index = this.accidentForm['index'];
            }
        }
        else {
            this.accidentForm['vehicles'] = [this.vehicleFormGroup.value];
        }
        console.log("Accident Form - ", this.accidentForm);
    }

    ionViewDidLoad() {
        console.log('AddVehiclePage');
        this.navBar.backButtonClick = (e: UIEvent) => {
            // todo something
            setTimeout(() => {
                this.navCtrl.getPrevious().data = this.accidentForm.value;
                this.navCtrl.pop();
            }, 0);
        }
    }

    ngOnInit() {
    }

    getVehicleFormGroup() {
        this.vehicleFormGroup = this.fb.group({
            number: [, [Validators.required]],
            model: [, [Validators.required]],
            medias: this.fb.array([]),
            persons: this.fb.array([], Validators.required)
        })
    }


    delVehicleImage(vehicleFormGroup: FormGroup, index: number) {
        const vehiclePics = <FormArray>vehicleFormGroup.controls['medias'];
        vehiclePics.removeAt(index);
        this.vehicleImageUrls.splice(index, 1);
    }

    addPerson() {
        const modal = this.modalCtrl.create('AddPersonPage', { persons: this.vehicleFormGroup.controls['persons'] });
        modal.present();
    }

    editPerson(index) {
        if (index == 0) {
            const modal = this.modalCtrl.create('AddDriverPage', { persons: this.vehicleFormGroup.controls['persons'], index: index });
            modal.present();
        }
        else {
            const modal = this.modalCtrl.create('AddPersonPage', { persons: this.vehicleFormGroup.controls['persons'], index: index });
            modal.present();
        }
    }

    removePerson(index) {
        const persons = <FormArray>this.vehicleFormGroup.controls['persons'];
        persons.removeAt(index);
    }

    addDriver() {
        const modal = this.modalCtrl.create('AddDriverPage', { persons: this.vehicleFormGroup.controls['persons'] });
        modal.present();
    }

    removeDriver(index) {
        const driver = <FormArray>this.vehicleFormGroup.controls['persons'];
        driver.removeAt(index);
    }

    addPedestrian() {
        if (!this.accidentForm['pedestrians']) {
            this.accidentForm['pedestrians'] = [];
        }
        const modal = this.modalCtrl.create('AddPedestrianPage', { accident: this.accidentForm })
        modal.present();
        modal.onDidDismiss(response => {
            console.log(response);
            this.accidentForm = response.accident
        });
    }

    removePedestrian(index) {
        const pedestrian = this.accidentForm['pedestrians'];
        // pedestrian.removeAt(index);
        pedestrian.splice(index, 1);
    }

    saveVehicle() {

        this.accidentForm['index'] = this.index;
        this.accidentForm['vehicles'][this.index] = this.vehicleFormGroup.value;
        console.log(this.accidentForm);
        // this.submitAccidentPage();

        this.toastSev.showLoader();
        const formData = this.convertModelToFormData(this.vehicleFormGroup.value, new FormData(), '');
        this.accSev.addVehicleReport(this.accidentForm['id'], formData).subscribe(response => {
            console.log(response);
            this.accidentForm['vehicles'][this.index] = response;
            this.accidentForm['index']++;
            this.toastSev.hideLoader();
            if (this.accidentForm['index'] < this.accidentForm['numOfVehicle']) {
                this.toastSev.showToast('Vehicle Added Successfully');
                this.navCtrl.push(AddVehiclePage, { accident: this.accidentForm });
            }
            else {
                this.accidentForm['index']++;
                this.toastSev.showToast('Vehicle Added Successfully !');
                this.submitAccidentPage();
            }

        }, error => {
            console.log(error);
            this.toastSev.hideLoader();
        });
    }

    submitAccidentPage() {
        this.navCtrl.push(SubmitAccidentPage, { accident: this.accidentForm });
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






}