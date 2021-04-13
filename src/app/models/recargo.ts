export enum EnumTipoRecargo {
    porcentaje = 1, 
    monto = 2, 
}


export class Recargo{
    public tipo =EnumTipoRecargo.monto;
    public monto = "";
    public motivo="";

	constructor( 
		
		){
    }
    
    public asignarValores(init?: Partial<Recargo>) {
        Object.assign(this, init);
    }
}