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
    plan:Plan;
    pagoAdelantado= "true" ;
    descripcion_venta="";
    recibirReservas=true;

	public constructor() {
       this.plan = new Plan();
    }

    public asignarValores(init?: Partial<Servicio>) {
        Object.assign(this, init);
    }
    
    
}