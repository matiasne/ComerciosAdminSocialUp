export class Categoria{
    public id ="";
    public foto ="";
    public comercioId = "";
    public nombre:string;
    public descripcion ="";
    public updatedAt:any;

    public woocommerce = {
        sincronizado:false,
        id:"",
        lastUpdate:undefined
    }
    
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Categoria>) {
        Object.assign(this, init);
    }
}