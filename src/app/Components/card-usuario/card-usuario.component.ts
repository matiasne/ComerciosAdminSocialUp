import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-usuario',
  templateUrl: './card-usuario.component.html',
  styleUrls: ['./card-usuario.component.scss'],
})
export class CardUsuarioComponent implements OnInit {

  @Input() cliente:any;
  @Output() select = new EventEmitter<any>();
  @Input() showAvatar = false; 
  
  constructor() { }

  ngOnInit() {
  
      console.log(this.cliente)
  }

  seleccionar(){
    this.select.emit();
  }

}
