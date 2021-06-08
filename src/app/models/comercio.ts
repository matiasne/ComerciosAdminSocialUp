import { Localizacion } from "./localizacion";

export class Comercio {

    public id="";
    public nombre:"";
    public telefono:"";
    public icono = {
        url:""
    };
    public portada = "";
    public createdAt= "";
    public descripcion= "";
    public horarios=[];
    public direccion:Localizacion;    
    public geopoint:any;
    public recibirPedidos = true;
    public recibirReservas = true;
    public rolComandatarios = [];
    public rolCadetes = [];
    public rolEncargados = [];

    public plan = "FREE";
    
    public config  = {
        productos:true,
        servicios:true,
        comandas: true,
        cocinas:true,
        mesas:true,
        clientes:true,
        woocommerce:true,
        afip:true,
        cobrarDirectamente: false,
        movimientosCajas:true,
        ctasCorrientes:true,
        stock:true,
        beneficiosClientes:true,
        beneficiosPorPuntaje:false,
        productosImages:true,
        admob:true,
        productosMaxLength:40,
        serviciosMaxLength:40,
        clientesMaxLength:100,
        cajasMaxLength:2
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

    public woocommerce = {
        user:"",
        password:"",
        url:"",
        consumerKey:"",
        consumerSecret:""
    }

    public keywords = [];

	public constructor() {
       this.direccion = new Localizacion()
    }

    public asignarValores(init?: Partial<Comercio>) {
        Object.assign(this, init);
    }
    
    
}