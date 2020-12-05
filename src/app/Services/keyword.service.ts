import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  constructor() { }

  public agregarKeywords(objeto,palabras){    
    objeto.keywords.push('');
    objeto.keywords.push(' ');

    console.log(palabras)
    
    palabras.forEach(palabra => {
      objeto.keywords.push(palabra);
      let p = palabra.toLowerCase().split(" ");
      p.forEach(element => {
        objeto.keywords = objeto.keywords.concat(this.createKeywords(element));
      });
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
