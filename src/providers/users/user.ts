import { TranslationProvider } from '../translation/translation';
import { Message } from '../messages/message';
import { MessageController } from '../messages/message-controller';
import { SpeechRecognition, SpeechRecognitionListeningOptionsAndroid, SpeechRecognitionListeningOptionsIOS } from '@ionic-native/speech-recognition';
import {EventEmitter} from '@angular/core';
import {Platform} from "ionic-angular";

export class User {
  history: Array<Message> = [];
  tempMessage: Message = null;

  options: SpeechRecognitionListeningOptionsAndroid | SpeechRecognitionListeningOptionsIOS;

  constructor(public language: string|null,
              private messageEmitter: EventEmitter<Message>,
              private updateEmitter: EventEmitter<any>,
              private speechRecognition: SpeechRecognition,
              private translation: TranslationProvider,
              private messageCtrl: MessageController,
              platform: Platform) {
    this.messageEmitter.subscribe(this.addMessage.bind(this));

      this.options = platform.is('android') ?
          { matches: 1, showPopup: false } :
          { matches: 1, showPartial: true }
  }

  clearHistory() {
    this.history = [];
    this.updateEmitter.emit();
  }

  isListening() {
    return this.tempMessage !== null;
  }

  toggleListening() {
    if (this.isListening()) {
      this.stopListening();
      return;
    }

    this.tempMessage = this.messageCtrl.create(this);

    this.options.language = this.language;
    this.speechRecognition.startListening(this.options)
        .subscribe((matches: Array<string>) => {
      const match = matches[0];

      if(this.isListening()) {
        this.tempMessage.update(match);
        this.updateEmitter.emit();
      }
    });
  }

  private stopListening() {
    this.speechRecognition.stopListening();

    if (!this.tempMessage.isEmpty())
      this.messageEmitter.emit(this.tempMessage);

    this.tempMessage = null;
  }

  private addMessage(message: Message) {
    this.getMessage(message).then((message: Message) => this.history.push(message)).then(() => this.updateEmitter.emit());
  }

  private getMessage(message: Message): Promise<Message> {
    return new Promise((resolve) => {
      if (message.language === this.language || this.language === null) {
        resolve(message);
      } else {
        const newMessage = message.clone();
        this.translation.translate(message.content, message.language, this.language).then((content: string) => {
          newMessage.language = this.language;
          newMessage.update(content);
          newMessage.speak();
          resolve(newMessage);
        });
      }
    });
  }
}