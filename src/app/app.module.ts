import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePageModule } from '../pages/home/home.module';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { HttpModule } from '@angular/http';
import { MessageController } from '../providers/messages/message-controller';
import { UserController } from '../providers/users/user-controller';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { SettingsProvider } from '../providers/settings/settings';
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
      ScreenOrientation,
    StatusBar,
    SplashScreen,
    SpeechRecognition,
    TextToSpeech,
    UserController,
    MessageController,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SettingsProvider
  ]
})
export class AppModule {
}
