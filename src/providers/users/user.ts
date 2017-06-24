import { TranslationProvider } from '../translation/translation';
import { Message } from '../messages/message';
import { MessageController } from '../messages/message-controller';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { EventEmitter } from '@angular/core';

export class User {
  history: Array<Message> = [];
  tempMessage: Message = null;

  constructor(public language: string|null, private messageEmitter: EventEmitter<Message>,
              private speechRecognition: SpeechRecognition, private translation: TranslationProvider,
              private messageCtrl: MessageController) {
    this.messageEmitter.subscribe(this.addMessage.bind(this));
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

    this.speechRecognition.startListening({ language: this.language, showPartial: true })
        .subscribe((matches: Array<string>) => this.tempMessage.update(matches[0]));
  }

  private stopListening() {
    this.speechRecognition.stopListening();

    if (!this.tempMessage.isEmpty())
      this.messageEmitter.emit(this.tempMessage);

    this.tempMessage = null;
  }

  private addMessage(message: Message) {
    this.getMessage(message).then((message: Message) => this.history.push(message));
  }

  private getMessage(message: Message): Promise<Message> {
    return new Promise((resolve) => {
      if (message.language === this.language || this.language === null) {
        resolve(message);
      } else {
        const newMessage = message.clone();
        this.translation.translate(message.content, message.language, this.language).then((content: string) => {
          newMessage.language = this.language;
          newMessage.content = content;
          newMessage.speak();
          resolve(newMessage);
        });
      }
    });
  }
}