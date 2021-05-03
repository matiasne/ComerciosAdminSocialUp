export class Impresora{

    public escposBluetooth = false;
    public mac="";

    public comandas = false;   
    
    public subsComanda = false;
    public subsPedido = false;
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Impresora>) {
        Object.assign(this, init);
    }
}