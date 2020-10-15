export class Notificacion{
    public id ="";
    public userId="";
    public foto ="";
    public titulo = "";
    public mensaje:"";
    public tipo ="";
    public estado ="pendiente"; //pendiente-leida
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Notificacion>) {
        Object.assign(this, init);
    }
}