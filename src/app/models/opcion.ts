export class Opcion{
    nombre="";
    precioVariacion=0;  
    habilitado=true;    
    seleccionada = false;  
    cantidad: any;
  
	constructor(){
        
    }

    public asignarValores(init?: Partial<Opcion>) {
        Object.assign(this, init);
    }
}