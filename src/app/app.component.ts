import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ScreenOrientation} from "@ionic-native/screen-orientation";

import { HomePage } from '../pages/home/home';
import {SettingsProvider} from "../providers/settings/settings";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(public settings: SettingsProvider,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              screenOrientation: ScreenOrientation,
              ) {
    platform.ready().then(() => {
      // Lock screen orientation
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      // Set status bar to default style
      statusBar.styleDefault();
      // Hide splash screen
      splashScreen.hide();
    });
  }
}
