import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Message } from './message';
import { User } from '../users/user';
import {SettingsProvider} from "../settings/settings";

@Injectable()

export class MessageController {
  constructor(private tts: TextToSpeech,
              private settings: SettingsProvider) {
  }

  create(user: User, text: string = null): Message {
    return new Message(text, user, this.tts, this.settings);
  }
}
