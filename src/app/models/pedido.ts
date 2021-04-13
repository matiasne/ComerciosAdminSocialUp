import { Producto } from './producto';
import { Comercio } from './comercio';
import { Servicio } from './servicio';
import { MovimientoCtaCorriente } from './movimientoCtaCorriente';
import { Pagare } from './pagare';
import { Descuento } from './descuento';
import { Recargo } from './recargo';

export enum EnumEstadoComanda {
    rechazado = 1, 
    solicitado = 2, 
    tomado = 3,  
    completo = 4,
    finalizado = 5, 
    suspendido = 6
}


export enum EnumEstadoEnCaja {
    pendiente = 1, 
    suspendido = 2, 
    cobrado = 3,  
}


export class Pedido{      

    public id="";

    public statusComanda = EnumEstadoComanda.solicitado;
    public statusCaja = EnumEstadoEnCaja.pendiente;


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
 
    public descuentos:Descuento[] =[];
    public recargos:Recargo[]=[];
    public productos:Producto[] = [];
    public servicios:Servicio[] = [];
	 
    public cantidadComentarios = 0;

    public createdAt:any

    public countListos = 0
    
	constructor(){


    }

    public asignarValores(init?: Partial<Pedido>) {
        Object.assign(this, init);
    }

    
}