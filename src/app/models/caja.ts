export class Caja{
    public id ="";
    public comercioId = "";
    public nombre="";
    public efectivo:false;
    public debito:false;
    public credito:false;
    public ctaCorriente:false;
    public totalEfectivo = 0;
    public totalDebito = 0;
    public totalCredito = 0;
    public totalCtaCorriente = 0;

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Caja>) {
        Object.assign(this, init);
    }
}