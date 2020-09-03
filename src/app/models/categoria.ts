export class Categoria{
    public id ="";
    public foto ="";
    public comercioId = "";
    public nombre:"";
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Categoria>) {
        Object.assign(this, init);
    }
}