import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {

  constructor(private events: Events, private network: Network) { }

    checkNetworkStatus() {

        this.network.onConnect().subscribe(() => {

            this.events.publish("online");
        });
        this.network.onDisconnect().subscribe(() => {
            
            this.events.publish("offline");
        });
    }

}
