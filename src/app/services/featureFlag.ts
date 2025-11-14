import { Injectable } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  showSpecialButton$ = new BehaviorSubject<boolean>(false);

  constructor(private remoteConfig: AngularFireRemoteConfig) {
    this.init();
  }

  async init() {
    await this.remoteConfig.fetchAndActivate();
    const flagValue = this.remoteConfig.getBoolean('showSpecialButton');
    this.showSpecialButton$.next(await flagValue);
  }
}
