export class Impresora{

    public nombre = "";
    public mac ="04:7F:0E:06:15:5B";
    public comandas = false;  
    public comandasCocina = false;
    public cocinas = [];  
    public ticketConsumidor = false;   
    public conectada = false;

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Impresora>) {
        Object.assign(this, init);
    }
}