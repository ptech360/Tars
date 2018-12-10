import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AccidentProvider } from '../../providers/accident/accident';

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
export class ReportAccidentPage {

  accidentForm:FormGroup;
  accidentTypes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb:FormBuilder, public accSev: AccidentProvider) {
    this.accidentForm = this.getAccidentForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportAccidentPage');
    this.accSev.getAccidentTypes().subscribe(response => {
      this.accidentTypes = response;
    })
  }

  getAccidentForm(){
    return this.fb.group({
      geoLocation:[''],
      accidentType: [''],
      involvedVehicles: this.fb.array([this.getVehicleFormGroup()]),
      otherPeopleInvolved: [''],
      incidentPhotos:[''],
      incidentDescription:[''],
      remarks:['']
    });
  }

  getVehicleFormGroup(){
    return this.fb.group({
      vehicleNumber: [''],
      vehicleModel: [''],
      vehicleImages: [[]],
      driver:this.fb.group({
        name:[''],
        drivingLicence:['']
      }),
      passengers:this.fb.array([this.getPassenger()]),
    });
  }

  getPassenger(){
    return this.fb.group({
      name:['']
    });
  }

  addVehicle(){
    console.log("asdf");
    
    const involvedVehicles = <FormArray>this.accidentForm.controls['involvedVehicles'];
    involvedVehicles.push(this.getVehicleFormGroup());

  }

  addPassenger(){
    const passengers = <FormArray>this.accidentForm.controls['passengers'];
    passengers.push(this.getPassenger());
  }
  
  removeVehicle(index: number){
    const involvedVehicles = <FormArray>this.accidentForm.controls['involvedVehicles'];
    involvedVehicles.removeAt(index);

  }

  removePassenger(index:number){
    const passengers = <FormArray>this.accidentForm.controls['passengers'];
    passengers.removeAt(index);
  }

}
