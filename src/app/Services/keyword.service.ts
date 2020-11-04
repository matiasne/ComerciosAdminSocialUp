import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  constructor() { }

  agregarKeywords(objeto,palabras){
    palabras.forEach(element => {
      objeto.keywords = [...this.createKeywords(element)];
    });
  }

  private createKeywords(name){
    const arrName = [];
    let curName = '';
    name.split('').forEach(letter => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  }
  
}
