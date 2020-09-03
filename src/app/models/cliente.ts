export class Cliente{

    public id="";
    public comercioId="";
    public nombre="";
    public documento_tipo ="";  
    public documento ="";  
    public fecha_nacimiento="";
    public direccion="";
    public telefono="";   
    public email="";   
    public descripcion="";   
    public direccion_piso="";
    public direccion_puerta="";
    public foto="";
    public latitud="";
    public longitud="";
    public createdAt="";
    public vendedorId="";

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Cliente>) {
        Object.assign(this, init);
    }
}
