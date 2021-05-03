import { GrupoOpciones } from './grupoOpciones';
import { Opcion } from './opcion';
import { OpcionSeleccionada } from './opcionSeleccionada';

export class Producto {

    public id="";
    public suspendido = 0;
    
    public nombre = "";
    public barcode="";
    public cocinaId ="";
    public cocinaNombre =""; //Se rellena cuando se pide el producto
    public precio = 0;
    public precioTotal = 0;
    public promocion="";
    public destacado = false;
    public unidad="";
    public valorPor = 0;
    public stock = 0;
    public descripcion="";
    public categorias=[];
    public fotoPrincipal="";
    public createdAt="";  
    public updatedAt:any;
    public cantidad =0;
    public descripcion_venta="";
    public recibirPedidos=true;
    public gruposOpcionesId = [];
    public gruposOpciones:GrupoOpciones[];
    public opcionesSeleccionadas =[];
    public keywords = [];
    public estadoComanda = "";

    public enCarrito = 0

    public woocommerce = {
        sincronizado:false,
        id:"",
        lastUpdate:new Date()
    }
    

	public constructor() {
        this.gruposOpciones = [];
        this.opcionesSeleccionadas =[];
    }

    public asignarValores(init?: Partial<Producto>) {
        Object.assign(this, init);
    }
    
    
}