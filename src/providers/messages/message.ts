import { TextToSpeech } from '@ionic-native/text-to-speech';
import { User } from '../users/user';

export class Message {
  public language: string;

  constructor(public content: string, public user: User, public tts: TextToSpeech) {
    this.language = user.language;
  }

  clone() {
    return new Message(this.content, this.user, this.tts);
  }

  isEmpty(): boolean {
    return this.content === null || this.content === '';
  }

  update(content: string) {
    this.content = content;
  }

  speak(): Promise<any> {
    return this.tts.speak({
      text: this.content,
      locale: this.language
    });
  }
}