import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { translationConfig } from '../../config';

@Injectable()
export class TranslationProvider {
  constructor(private http: Http) {
  }

  translate(text: string, sourceLanguage: string, toLanguage: string): Promise<string> {
    return this.googleTranslate(text, sourceLanguage, toLanguage);
  }

  private googleTranslate(text: string, sourceLanguage: string, toLanguage: string): Promise<string> {
      if (sourceLanguage === toLanguage)
          return Promise.resolve(text);

    const params = {
      client: 'gtx',
      sl: sourceLanguage,
      tl: toLanguage,
      dt: 't',
      q: text
    };

    return new Promise((resolve) => {
      this.http.get(translationConfig.google, { params })
          .subscribe(responseObj => {
            let response = responseObj.text();
            while (response.indexOf(',,') != -1)
              response = response.replace(/,,/g, ', null,');
            response = JSON.parse(response);

            resolve(response[0][0][0]);
          });
    });
  }
}
