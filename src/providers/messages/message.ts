import { TextToSpeech } from '@ionic-native/text-to-speech';
import { User } from '../users/user';
import {SettingsProvider} from "../settings/settings";

export class Message {
  public language: string;

  constructor(public content: string, public user: User, private tts: TextToSpeech, private settings: SettingsProvider) {
    this.language = user.language;
  }

  clone() {
    return new Message(this.content, this.user, this.tts, this.settings);
  }

  isEmpty(): boolean {
    return this.content === null || this.content === '';
  }

  update(content: string) {
    this.content = content;
  }

  speak(): Promise<any> {
    if(!this.settings.get('isSpeak'))
      return Promise.resolve();

    return this.tts.speak({
      text: this.content,
      locale: this.language,
      rate: 1.5 * this.settings.get('speechSpeed')
    });
  }
}