import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Message } from './message';
import { User } from '../users/user';

@Injectable()

export class MessageController {
  constructor(public tts: TextToSpeech) {
  }

  create(user: User, text: string = null): Message {
    return new Message(text, user, this.tts);
  }
}
