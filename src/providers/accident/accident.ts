// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { FormGroup } from '@angular/forms';

/*
  Generated class for the AccidentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccidentProvider {

  accidentReport:FormGroup;

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
      geoLocation: "Nirvana, Block J, Mayfield Garden, Sector 51, Gurugram",
      incidentDescription: "Suddenly changed the direction",
      noOfCasulities:3,
      noOfVehicle:1,
      initiate:'Ambulance, Fire Vehicle',
      dateTime:new Date(),
      incidentPhotos: [{
        name: "vehicle-img2018-12-11135631.jpeg",
        url: "/assets/imgs/180710_wabc.jpg"
      }],
      involvedVehicles: [{
        driver: {
          name: "Pankaj Kharetwal", 
          drivingLicence: "MP28N-2012-0164333",
          age:'26',
          underInfluence:false,
          gender:'Male',
          address:'Chhindwara MP',
          pictures:[],
        },
        passengers: [{
          name: "Aniket Verma", 
          drivingLicence: "MP28N-2012-0189333",
          age:'22',
          underInfluence:true,
          gender:'Male',
          address:'Chhindwara MP',
          pictures:[]
        }],
        vehicleImages: [{
          name: "vehicle-img2018-12-11135631.jpeg",
          url: "/assets/imgs/51f97d2a6c444.image.jpg"
        }],
        vehicleModel: "BDHHD12-67",
        vehicleNumber: "UP20MC5678"
      }],
      otherPeopleInvolved: [{
        name: "Ashok Pal", 
        drivingLicence: "MP28N-1991-0164113",
        age:'36',
        underInfluence:false,
        gender:'Male',
        address:'Chhindwara MP',
        pictures:[],
      }],
      remarks: "Koiti sngara squar",
      primaryAndSecondaryCausesOfTheAccident:'designers to design the form of the content be itself has been',
      drawingOfAccidentDetails:'designers the content before the content itself has been',
      informationOnAnalysingAgencyAndPersonnel: 'design content before the content itself has been',
      fir: 'FIR'+Math.random()
    }
  ]
  constructor() {
    console.log('Hello AccidentProvider Provider');
  }

  getAccidentTypes(){
    return of(this.accidentTypes);
  }

  getAccidentReports(){
    return of(this.accidentReports);
  }

  addAccidentReport(object:any){
    this.accidentReports.push(object);
    return of({status:200});
  }

}
