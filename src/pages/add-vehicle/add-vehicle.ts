import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController, AlertController, NavController, Navbar } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { ToastProvider } from '../../providers/toast/toast';
import { Console } from '@angular/core/src/console';
import { AddPedestrianPage } from '../add-pedestrian/add-pedestrian';
import { SubmitAccidentPage } from '../submit-accident/submit-accident';
import { AddDriverPage } from '../add-driver/add-driver';
import { AddPersonPage } from '../add-person/add-person';

@Component({
    selector: 'page-add-vehicle',
    templateUrl: 'add-vehicle.html',
})
export class AddVehiclePage implements OnInit {
    accidentGlobalObject: any;
    @ViewChild(Navbar) navBar: Navbar;
    vehicleFormGroup: FormGroup;
    vehicleImageUrls = [];
    personTypes = [];


    constructor(public navParams: NavParams,
        public fb: FormBuilder,
        public accSev: AccidentProvider,
        public modalCtrl: ModalController,
        private accService: AccidentProvider,
        public toastSev: ToastProvider,
        public alertCtrl: AlertController,
        private navCtrl: NavController) {
        this.accidentGlobalObject = this.navParams.get('accident');
        this.vehicleFormGroup = this.fb.group({
            id: [],
            number: ['', [Validators.required]],
            model: ['', [Validators.required]],
            medias: this.fb.array([]),
            persons: this.fb.array([], Validators.minLength(1)),
        })

        if (this.accidentGlobalObject.hasOwnProperty('vehicleCounter') && this.accidentGlobalObject.hasOwnProperty('vehicles')) {
            this.patchVehicle();
        }
    }

    patchVehicle() {
        const currentVehicle = this.accidentGlobalObject.vehicles[this.accidentGlobalObject.vehicleCounter]
        if (this.accidentGlobalObject.vehicles && currentVehicle) {
            this.vehicleFormGroup.patchValue(currentVehicle)
            if (currentVehicle.persons && currentVehicle.persons.length) {
                const persons = <FormArray>this.vehicleFormGroup.controls['persons']
                currentVehicle.persons.forEach(person => {
                    persons.push(this.fb.group(person))
                });
            }
            if (currentVehicle.medias && currentVehicle.medias.length) {
                const medias = this.vehicleFormGroup.controls['medias']
                currentVehicle.medias.forEach(media => {
                    medias.patchValue(this.fb.group(media))
                });
            }
        }
    }

    ionViewDidLoad() {
        console.log('AddVehiclePage');
        this.navBar.backButtonClick = (e: UIEvent) => {
            // todo something
            if (this.accidentGlobalObject.hasOwnProperty('vehicleCounter')) {
                this.accidentGlobalObject.vehicleCounter--;
            }
            this.navCtrl.pop();
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

    addPerson() {
        const modal = this.modalCtrl.create(AddPersonPage, { persons: this.vehicleFormGroup.controls['persons'] });
        modal.present();
    }

    editPerson(index) {
        if (index == 0) {
            const modal = this.modalCtrl.create(AddDriverPage, { persons: this.vehicleFormGroup.controls['persons'], index: index });
            modal.present();
        }
        else {
            const modal = this.modalCtrl.create(AddPersonPage, { persons: this.vehicleFormGroup.controls['persons'], index: index });
            modal.present();
        }
    }

    removePerson(index) {
        const persons = <FormArray>this.vehicleFormGroup.controls['persons'];
        persons.removeAt(index);
    }

    addDriver() {
        const modal = this.modalCtrl.create(AddDriverPage, { persons: this.vehicleFormGroup.controls['persons'] });
        modal.present();
    }

    removeDriver(index) {
        const driver = <FormArray>this.vehicleFormGroup.controls['persons'];
        driver.removeAt(index);
    }

    saveVehicle() {
        this.toastSev.showLoader();
        if (this.vehicleFormGroup.value.id) {
            const formData = this.convertModelToFormData(this.vehicleFormGroup.value, new FormData(), '');
            this.accSev.editVehicleReport(this.accidentGlobalObject.id, this.vehicleFormGroup.value.id, formData).subscribe(response => {
                if (this.accidentGlobalObject.vehicles && this.accidentGlobalObject.vehicles.length) {
                    if (response.medias == null) response.medias = []
                    this.accidentGlobalObject.vehicles.push(response);
                    this.accidentGlobalObject.vehicleCounter++;
                } else {
                    this.accidentGlobalObject.vehicles = [];
                    if (response.medias == null) response.medias = [];
                    this.accidentGlobalObject.vehicles.push(response);
                    this.accidentGlobalObject.vehicleCounter = 0;
                }
                this.toastSev.hideLoader();
                this.toastSev.showToast('Vehicle Updated Successfully');
                if (this.accidentGlobalObject.vehicles.length < this.accidentGlobalObject.numOfVehicle) {
                    this.navCtrl.push(AddVehiclePage, { accident: this.accidentGlobalObject });
                } else {
                    this.navCtrl.push(SubmitAccidentPage, { accident: this.accidentGlobalObject });
                }
            }, error => {
                console.log(error);
                this.toastSev.hideLoader();
            });
        } else {
            delete this.vehicleFormGroup.value.id;
            const formData = this.convertModelToFormData(this.vehicleFormGroup.value, new FormData(), '');
            this.accSev.addVehicleReport(this.accidentGlobalObject.id, formData).subscribe(response => {
                this.vehicleFormGroup.get('id').patchValue(response.id)
                if (this.accidentGlobalObject.vehicles && this.accidentGlobalObject.vehicles.length) {
                    if (response.medias == null) response.medias = []
                    this.accidentGlobalObject.vehicles.push(response);
                    this.accidentGlobalObject.vehicleCounter++;
                } else {
                    this.accidentGlobalObject.vehicles = [];
                    if (response.medias == null) response.medias = [];
                    this.accidentGlobalObject.vehicles.push(response);
                    this.accidentGlobalObject.vehicleCounter = 0;
                }
                this.toastSev.hideLoader();
                this.toastSev.showToast('Vehicle Added Successfully');
                if (this.accidentGlobalObject.vehicles.length < this.accidentGlobalObject.numOfVehicle) {
                    this.navCtrl.push(AddVehiclePage, { accident: this.accidentGlobalObject });
                } else {
                    this.navCtrl.push(SubmitAccidentPage, { accident: this.accidentGlobalObject });
                }
            }, error => {
                console.log(error);
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






}