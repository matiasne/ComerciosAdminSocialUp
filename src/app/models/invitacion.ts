export class Invitacion{
    public id="";
    public remitente= "";
    public comercio_nombre= "";
    public comercioId= "";
    public email= "";
    public rol= "";
    public estado="";

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Invitacion>) {
        Object.assign(this, init);
    }
}