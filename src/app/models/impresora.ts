export class Impresora{

    public bluetooth = false;
    public mac="";

    public comandas = false;  
    public ticketConsumidor = false;   
    
    public subsComanda = false;
    public subsPedido = false;

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Impresora>) {
        Object.assign(this, init);
    }
}