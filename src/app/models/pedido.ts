import { Producto } from './producto';
import { Comercio } from './comercio';
import { Servicio } from './servicio';
import { MovimientoCtaCorriente } from './movimientoCtaCorriente';
import { Pagare } from './pagare';

export enum EnumEstadoComanda {
    rechazado = 1, 
    solicitado = 2, 
    tomado = 3,  
    completo = 4,
    finalizado = 5, 
    suspendido = 6
}

export class Pedido{      

    public id="";

    public statusComanda = EnumEstadoComanda.solicitado;
    public suspendido = 0;
    public cobrado = 0;

    public searchLogic = "00";

    public metodoPago = "";

    public personalId = "";
    public personalEmail="";
    public personalNombre="";

    public cliente:any
    public clienteId="";
	public clienteEmail="";
	public clienteNombre="";
    
    public mesaId = "";
    public mesaNombre = "";

    public totalProductos=0;
    public totalServicios=0;
  
    public on=false;

    public productos:Producto[] = [];
    public servicios:Servicio[] = [];
	 
    public cantidadComentarios = 0;
    
	constructor(){

       

    }

    public asignarValores(init?: Partial<Pedido>) {
        Object.assign(this, init);
    }

    
}