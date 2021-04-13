import { Plan } from './plan';

export class Servicio {

    id="";
    plan = {
        id:"",
        nombre:"",
        precio:0,
        tipo:"", 
        dias:""
    }
    nombre ="";
    descripcion="";
    categorias=[];
    profesionales=[];
    foto="";
    createdAt="";
    fechaInicio ="";
    pagoAdelantado= "true" ;
    descripcion_venta="";
    recibirReservas=true;

    precio=0;
    tipo="";
    dias="";

	public constructor() {
    }

    public asignarValores(init?: Partial<Servicio>) {
        Object.assign(this, init);
    }
    
    
}