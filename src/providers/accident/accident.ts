// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { FormGroup } from '@angular/forms';
import { ApiProvider } from '../api/api';

/*
  Generated class for the AccidentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccidentProvider {

  accidentReport: FormGroup;

  accidentTypes = [
    {
      name: 'Vehicle Crashed',
      code: '001'
    },
    {
      name: 'Vehicle vs Vehicle Collision',
      code: '002'
    },
    {
      name: 'Vehicle Overturned',
      code: '003'
    },
    {
      name: 'Vehicle vs Pedestrian Collision',
      code: '004'
    }
  ]

  accidentReports = [
    {
      accidentType: "Vehicle vs Vehicle Collision",
      location: "Nirvana, Block J, Mayfield Garden, Sector 51, Gurugram",
      description: "Suddenly changed the direction",
      numOfCasualities: 3,
      numOfVehicle: 1,
      accidentInitiate: 'Ambulance, Fire Vehicle',
      createdAt: new Date(),
      remarks: "Koiti sngara squar",
      primaryAndSecondaryCauses: 'designers to design the form of the content be itself has been',
      drawing: 'designers the content before the content itself has been',
      analysingInfo: 'design content before the content itself has been',
      fir: 'FIR' + Math.random(),
      accidentPics: [{
        name: "vehicle-img2018-12-11135631.jpeg",
        url: "/assets/imgs/180710_wabc.jpg"
      }],
      vehicle: [{
        model: "BDHHD12-67",
        number: "UP20MC5678",
        person: [{
          name: "Pankaj Kharetwal",
          licence: "MP28N-2012-0164333",
          age: '26',
          underInfluence: false,
          gender: 'Male',
          address: 'Chhindwara MP',
          personPics: [],
          personType: ['person']
        },
        {
          name: "Aniket Verma",
          licence: "MP28N-2012-0189333",
          age: '22',
          underInfluence: true,
          gender: 'Male',
          address: 'Chhindwara MP',
          personPics: [],
          personType: ['passenger']
        }],
        vehiclePics: [{
          name: "vehicle-img2018-12-11135631.jpeg",
          url: "/assets/imgs/51f97d2a6c444.image.jpg"
        }]
      }],
      otherPerson: [{
        name: "Ashok Pal",
        licence: "MP28N-1991-0164113",
        age: '36',
        underInfluence: false,
        gender: 'Male',
        address: 'Chhindwara MP',
        personPics: [],
      }],
    }
  ]
  constructor(public api: ApiProvider) {
    console.log('Hello AccidentProvider Provider');
  }

  getBaseUrl(){
    return this.api.url;
  }

  getAccidentTypes() {
    // return of(this.accidentTypes);
    return this.api.get('api/accidentTypes');
  }

  getAccidentInitaites(){
    return this.api.get('api/initiates');
  }

  getAccidentReports() {
    // return of(this.accidentReports);
    return this.api.get('api/accidents');
  }

  reportAccident(data){
    return this.api.post('api/accident',data);
  }

  addAccidentReport(object: any) {
    // this.accidentReports.push(object);
    // return of({ status: 200 });
    return this.api.post('api/accident',object,{});
  }

}
