import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { Console } from '@angular/core/src/console';
import { AddPedestrianPage } from '../add-pedestrian/add-pedestrian';

@Component({
    selector: 'page-add-vehicle',
    templateUrl: 'add-vehicle.html',
})
export class AddVehiclePage implements OnInit {

    vehicleFormGroup: FormGroup;
    accidentForm: FormGroup;
    vehicleImageUrls = [];
    personTypes = [];
    index: number = 0;
    // vehicles : FormArray; 
    cameraOptions: CameraOptions = {
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        targetWidth: 600,
        targetHeight: 600,
    };


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
            // if(noofvehicles==vechiles.length-1){
            //     patch value
            // } else {}
            const vehicle = <FormArray>this.accidentForm['vehicles'];
            vehicle.push(this.vehicleFormGroup.value);
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
        this.accService.getPersonTypes().subscribe(res => {
            this.personTypes = res;
        });
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

    removePerson(index) {
        const persons = <FormArray>this.vehicleFormGroup.controls['persons'];
        persons.removeAt(index);
    }

    saveVehicle() {
        this.accidentForm['index'] = this.index;
        this.accidentForm['vehicles'][this.index] = this.vehicleFormGroup.value;
        this.toastSev.showLoader();
        // this.navCtrl.push(AddPedestrianPage, { accident: this.accidentForm });
        


        const formData = this.convertModelToFormData(this.vehicleFormGroup.value, new FormData(), '');
        this.accSev.addVehicleReport(this.accidentForm['id'], formData).subscribe(response => {
            console.log(response);
            this.accidentForm['index']++;
            this.toastSev.hideLoader();
            if (this.accidentForm['index'] < this.accidentForm['numOfVehicle']) {
                this.toastSev.showToast('Vehicle Added Successfully');
                this.navCtrl.push(AddVehiclePage, { accident: this.accidentForm });
            }
            else {
                this.accidentForm['index']=0;
                this.navCtrl.push(AddPedestrianPage, { accident: this.accidentForm });
            }

        }, error => {
            console.log(error);
            this.toastSev.hideLoader();
        });
    }

    showError = (message) => {
        const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['OK']
        })
        alert.present();
    }



    private captureVehicle(vehicleFormGroup: FormGroup) {
        this.camera.getPicture(this.cameraOptions).then((onSuccess) => {
            console.log(onSuccess);
            const vehiclePics = <FormArray>vehicleFormGroup.controls['medias'];
            const fileName: string = 'vehicle-img' + new Date().toISOString().substring(0, 10) + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
            let file = this.fb.group({
                name: fileName,
                url: 'data:image/jpeg;base64,' + onSuccess
            });
            this.vehicleImageUrls.push(file);
            vehiclePics.push(new FormControl(this.dataURLtoFile('data:image/jpeg;base64,' + onSuccess, fileName)));
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