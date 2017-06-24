import { EventEmitter, Injectable } from '@angular/core';
import { User } from './user';
import { TranslationProvider } from '../translation/translation';
import { MessageController } from '../messages/message-controller';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Message } from '../messages/message';

@Injectable()
export class UserController {
  constructor(private speechRecognition: SpeechRecognition, private translation: TranslationProvider,
              private messageCtrl: MessageController) {
  }

  create(language: string, messageEmitter: EventEmitter<Message>): User {
    return new User(language, messageEmitter, this.speechRecognition, this.translation, this.messageCtrl);
  }
}
