export enum EnumBeneficioDisparador {
    sinDefinir = 0,
    compraMayorA = 1,  
    primerRegitro = 3,  
}

export class Beneficio{
    public id ="";
    public disparador:any
    public monto="";
    public descripcion = "";
    public comercioId=""; //esto se agrega cuando es un adquirido
    public clienteId=""; //esto se agrega cuando es un adquirido
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Beneficio>) {
        Object.assign(this, init);
    }
}