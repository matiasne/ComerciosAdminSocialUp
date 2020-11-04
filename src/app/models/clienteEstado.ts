export class ClienteEstado{
    public id ="";
    public foto ="";
    public comercioId = "";
    public nombre:"";
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<ClienteEstado>) {
        Object.assign(this, init);
    }
}