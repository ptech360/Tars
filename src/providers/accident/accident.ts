// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';

/*
  Generated class for the AccidentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccidentProvider {

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
      geoLocation: "Gurgoan",
      incidentDescription: "Suddenly changed the direction",
      dateTime:new Date(),
      incidentPhotos: [{
        name: "vehicle-img2018-12-11135631.jpeg",
        url: "/assets/imgs/180710_wabc.jpg"
      }],
      involvedVehicles: [{
        driver: {name: "Pankaj Kharetwal", drivingLicence: "MP28N-2012-0164333"},
        passengers: [{
          name: "Aniket"
        }],
        vehicleImages: [{
          name: "vehicle-img2018-12-11135631.jpeg",
          url: "/assets/imgs/51f97d2a6c444.image.jpg"
        }],
        vehicleModel: "BDHHD12-67",
        vehicleNumber: "UP20MC5678"
      }],
      otherPeopleInvolved: [{
        name: "Ashok"
      }],
      remarks: "Koiti sngara squar",
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
