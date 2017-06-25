import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Platform} from "ionic-angular";

interface Settings {
  isSpeak: boolean;
}

@Injectable()
export class SettingsProvider {
  settings: Settings = {
    isSpeak: true
  };

  constructor(platform: Platform, private storage: Storage) {
    platform.ready().then(this.load.bind(this));
  }

  private load(): Promise<any> {
    return this.storage.get("settings")
        .then(settings => Object.keys(settings).forEach(key => this.settings[key] = settings[key]))
        .catch(() => {});
  }

  private save(): Promise<any> {
    return this.storage.set("settings", this.settings);
  }

  set(setting: string, val: any) {
    this.settings[setting] = val;
    this.save();
  }

  get(setting) {
    return this.settings[setting];
  }
}
