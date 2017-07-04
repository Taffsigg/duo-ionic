import {ApplicationRef, Component, EventEmitter, QueryList, ViewChildren} from '@angular/core';
import { AlertController, Content, IonicPage, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { User } from '../../providers/users/user';
import { UserController } from '../../providers/users/user-controller';
import { Message } from '../../providers/messages/message';
import { MessageController } from '../../providers/messages/message-controller';
import {TranslationProvider} from "../../providers/translation/translation";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChildren(Content) contents: QueryList<Content>;

  supportedLanguages: Array<string> = ['en-US', 'he-IL'];

  users: Array<User> = [];

  private messageEmitter: EventEmitter<Message> = new EventEmitter<Message>();

  constructor(platform: Platform,
              private ref: ApplicationRef,
              private alertCtrl: AlertController,
              private speechRecognition: SpeechRecognition,
              private userCtrl: UserController,
              private messageCtrl: MessageController,
              private translation: TranslationProvider) {
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

    this.speechRecognition.isRecognitionAvailable()
        .then((available: boolean) => {
          if (!available) {
            notAvailable();
          } else {
            this.speechRecognition.hasPermission()
                .then((permission: boolean) => {
                  if (!permission)
                    this.speechRecognition.requestPermission().catch(notAvailable);
                }).catch(notAvailable);
          }
        }).catch(notAvailable);
  }

  private initUsers() {
    const updateEmitter: EventEmitter<any> = new EventEmitter<any>();

    let userLanguage = navigator.language;
    if (this.supportedLanguages.indexOf(userLanguage) === -1)
      userLanguage = null;

    this.users.push(this.userCtrl.create(userLanguage, this.messageEmitter, updateEmitter)); // Create user with local language
    this.users.push(this.userCtrl.create('en-US', this.messageEmitter, updateEmitter)); // TODO find which country user is in, and use GPS to set language

    this.greet();

    updateEmitter.subscribe(() => {
      this.ref.tick();
      setTimeout(() => this.contents.forEach(content => content.scrollToBottom()), 0);
    });
  }

  isListening(): boolean {
    // if not everybody not listening, someone is
    return !this.users.every(user => !user.isListening());
  }

  clearHistory() {
    this.users.forEach(user => user.clearHistory());
  }

  greet() {
    const getGreet = (user) => this.translation.translate("Hello!", "en-US", user.language);

    getGreet(this.users[0]).then((message) => {
      this.messageEmitter.emit(this.messageCtrl.create(this.users[0], message));
      getGreet(this.users[1]).then((message) => {
        this.messageEmitter.emit(this.messageCtrl.create(this.users[1], message));
      });
    });
  }
}
