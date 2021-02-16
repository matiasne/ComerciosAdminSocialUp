import { Producto } from './producto';
import { Comercio } from './comercio';
import { Servicio } from './servicio';
import { MovimientoCtaCorriente } from './movimientoCtaCorriente';
import { Pagare } from './pagare';

export class Pedido{      

    public id="";

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
	 
    
	constructor(){
    }

    public asignarValores(init?: Partial<Pedido>) {
        Object.assign(this, init);
    }

    
}