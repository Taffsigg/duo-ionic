import { Component, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { AlertController, Content, IonicPage, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { User } from '../../providers/users/user';
import { UserController } from '../../providers/users/user-controller';
import { Message } from '../../providers/messages/message';
import { MessageController } from '../../providers/messages/message-controller';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChildren(Content) contents: QueryList<Content>;

  supportedLanguages: Array<string> = ['en-US', 'he-IL'];

  users: Array<User> = [];

  constructor(platform: Platform, private speechRecognition: SpeechRecognition, private alertCtrl: AlertController,
              private userCtrl: UserController, private messageCtrl: MessageController) {
    platform.ready().then(this.init.bind(this));
  }

  private init() {
    this.getPermission();

    this.speechRecognition.getSupportedLanguages().then(supportedLanguages => {
      this.supportedLanguages = supportedLanguages.sort();
      this.initUsers();
    }, this.initUsers.bind(this));
  }

  private getPermission() {
    const notAvailable = () => {
      this.alertCtrl.create({
        title: 'Speech recognition is not available',
        enableBackdropDismiss: false
      }).present();
    };

    this.speechRecognition.isRecognitionAvailable().then((available: boolean) => {
      if (!available) {
        notAvailable();
      } else {
        this.speechRecognition.hasPermission().then((permission: boolean) => {
          if (!permission)
            this.speechRecognition.requestPermission();
        });
      }
    }, notAvailable);
  }

  private initUsers() {
    const messageEmitter: EventEmitter<Message> = new EventEmitter<Message>();

    let userLanguage = navigator.language;
    if (this.supportedLanguages.indexOf(userLanguage) === -1)
      userLanguage = null;

    this.users.push(this.userCtrl.create(userLanguage, messageEmitter)); // Create user with local language
    this.users.push(this.userCtrl.create('en-US', messageEmitter)); // TODO find which country user is in, and use GPS to set language

    messageEmitter.emit(this.messageCtrl.create(this.users[1], 'Initializing'));
  }

  isListening(): boolean {
    // if not everybody not listening, someone is
    return !this.users.every(user => !user.isListening());
  }

  clearHistory() {
    this.users.forEach(user => user.clearHistory());
  }
}
