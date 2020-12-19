export class Comercio {

    public id="";
    public nombre:"";
    public telefono:"";
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
    public piso="";
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
    public rolComandatarios = [];
    public rolCadetes = [];
    public rolEncargados = [];

    public modulos  = {
        productos:false,
        servicios:false,
        comandas: false,
        mesas:false,
        clientes:false,
        pedidos: false,
        cajas:false,
        ctasCorrientes:false,
        stock:false
    }

    public colores = {
        primary:"",
        secondary:"",
        tertiary:"",
        success:"",
        warning:"",
        danger:"",
        light:"",
        medium:"",
        dark:""
    }

    public keywords = [];

	public constructor() {
       
    }

    public asignarValores(init?: Partial<Comercio>) {
        Object.assign(this, init);
    }
    
    
}