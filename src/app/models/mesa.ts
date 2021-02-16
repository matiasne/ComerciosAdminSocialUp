export class Mesa{
    public id ="";
    public comercioId = "";
    public nombre="";
    public foto="";
    public rolEncargados = [];
    public habilitarNotificaciones = false;
    public recibePedidosApp = false;
    public habilitarLlamadorMozoApp = false;
    public habilitarComandasApp = false;
    public productos = [];
    public cobrado = false;
    
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Mesa>) {
        Object.assign(this, init);
    }
}