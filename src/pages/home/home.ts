import { ApplicationRef, Component, QueryList, ViewChildren } from '@angular/core';
import { Content, IonicPage, Platform } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { TranslationProvider } from '../../providers/translation/translation';

export function nop() {
}

export class Message {
  constructor(public user: User, private language: string, public content) {
  }

  speak(tts: TextToSpeech) {
    tts.speak({ text: this.content, locale: this.language });
  }
}

export class User {
  language: string = null;
  history: Array<Message> = [];

  add(tp: TranslationProvider, user: User, text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.language === null) {
        reject();
        return;
      }

      if (user.language === this.language) {
        this.history.push(new Message(user, this.language, text));
        reject();
        return;
      }

      tp.translate(text, user.language, this.language).then(text => {
        const message = new Message(user, this.language, text);
        this.history.push(message);
        resolve(message);
      });
    });
  }
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChildren(Content) contents: QueryList<Content>;

  supportedLanguages: Array<string> = ['en-US', 'he-IL'];

  users: Array<User> = [new User(), new User()];

  currentlyListening: User = null;

  constructor(private ref: ApplicationRef, platform: Platform, private speechRecognition: SpeechRecognition,
              public tts: TextToSpeech, public tp: TranslationProvider) {
    platform.ready().then(() => {
      // Init supported languages
      this.speechRecognition.getSupportedLanguages().then(s => this.supportedLanguages = s, nop);
    });

    this.users[1].language = 'en-US';
    this.users[0].language = 'he-IL';

    this.users.forEach(u => u.add(this.tp, this.users[1], 'Hello').then(() => {
      this.users.forEach(u => u.add(this.tp, this.users[0], 'מה שלומך?').then(nop, nop));
    }, nop));
  }

  startListening(user: User) {
    const stop = () => {
      this.speechRecognition.stopListening();
      this.currentlyListening = null;
    };

    if (this.currentlyListening !== null) {
      stop();
      return;
    }

    this.currentlyListening = user;
    this.speechRecognition.startListening({ language: user.language }).subscribe((matches: Array<string>) => {
      const match = matches[0];
      this.users.forEach(u => u.add(this.tp, user, match).then(message => {
        message.speak(this.tts);
        this.ref.tick();
        setTimeout(() => this.contents.forEach(content => content.scrollToBottom()), 0);
      }, nop));
      stop();
    });
  }
}
