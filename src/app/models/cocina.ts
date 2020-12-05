export class Cocina{
    public id ="";
    public foto ="";
    public comercioId = "";
    public nombre:"";
    public cocineros = [];
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Cocina>) {
        Object.assign(this, init);
    }
}