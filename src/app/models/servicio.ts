import { Plan } from './plan';

export class Servicio {

    id="";
    nombre ="";
    descripcion="";
    categorias=[];
    profesionales=[];
    foto="";
    createdAt="";
    fechaInicio ="";
    plan:any;
    pagoAdelantado= "true" ;
    descripcion_venta="";
    recibirReservas=true;

	public constructor() {
    }

    public asignarValores(init?: Partial<Servicio>) {
        Object.assign(this, init);
    }
    
    
}