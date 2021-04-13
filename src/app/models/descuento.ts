export enum EnumTipoDescuento {
    porcentaje = 1, 
    monto = 2, 
}


export class Descuento{
    public tipo =EnumTipoDescuento.monto;
    public monto = "";
    public motivo="";

	constructor( 
		
		){
    }
    
    public asignarValores(init?: Partial<Descuento>) {
        Object.assign(this, init);
    }
}