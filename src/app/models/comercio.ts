export class Comercio {

    public id="";
    public nombre:"";
    public icono = "";
    public portada = "";
    public createdAt= "";
    public descripcion= "";
    public horarios=[];

    public direccion:"";
    
    public pais:"";
    public localidad:"";
    public calleNombre:"";
    public calleNumero:"";
    public puerta:"";
    public numero:"";
    public provincia:"";
    
    public posicion = {
        geohash:"",
        geopoint:{
            Latitude:"",
            Longitude:""
        }
    };

    public recibirPedidos = true;
    public recibirReservas = true;
    public recibirComandas = true;

    public rolComandatarios = [];
    public rolCadetes = [];

	public constructor() {
       
    }

    public asignarValores(init?: Partial<Comercio>) {
        Object.assign(this, init);
    }
    
    
}