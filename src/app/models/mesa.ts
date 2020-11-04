export class Mesa{
    public id ="";
    public comercioId = "";
    public nombre="";
    public foto="";
    public rolEncargados = [];
    public habilitaNotificaciones = false;


    
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Mesa>) {
        Object.assign(this, init);
    }
}