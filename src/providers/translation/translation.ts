import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

const googleTranslate = 'https://translate.googleapis.com/translate_a/single';

@Injectable()
export class TranslationProvider {

  constructor(public http: Http) {
  }

  translate(text, sourceLanguage, toLanguage) {
    let params = {
      client: 'gtx',
      sl: sourceLanguage,
      tl: toLanguage,
      dt: 't',
      q: text
    };

    return new Promise((resolve) => {
      this.http.get(googleTranslate, { params }).subscribe(responseObj => {
        let response = responseObj.text();
        while (response.indexOf(',,') != -1)
          response = response.replace(/,,/g, ', null,');
        response = JSON.parse(response);

        resolve(response[0][0][0]);
      });
    });
  }
}
