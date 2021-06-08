import { Localizacion } from "./localizacion";

export class Cliente{

    public id="";
    public comercioId="";
    public nombre="";
    public documento_tipo ="";  
    public documento ="";  
    public fecha_nacimiento="";
    public telefono="";   
    public email="";   
    public descripcion="";   
    public foto="";
    public createdAt:any;
    public vendedorId="";
    public estado="";
    public keywords = [];

    public direccion:Localizacion;

	constructor(
		
		){
            this.direccion = new Localizacion();
    }
    
    public asignarValores(init?: Partial<Cliente>) {
        Object.assign(this, init);
    }
}
