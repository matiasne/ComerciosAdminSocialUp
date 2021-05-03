import { Producto } from './producto';
import { Servicio } from './servicio';
import { Pagare } from './pagare';
import { Cliente } from './cliente';
import { Comanda } from './comanda';
import { MovimientoCtaCorriente } from './movimientoCtaCorriente';
import { Mesa } from './mesa';
import { Descuento } from './descuento';
import { Recargo } from './recargo';

export class Carrito{    
    public cliente:Cliente;
    public mesa:Mesa;
    public comandaId ="";
    public pedido ="";

    public on = false;

    public descuentos:Descuento[] =[];
    public recargos:Recargo[]=[];
    public productos:Producto[] = []; 
    public servicios:Servicio[] = [];

	constructor(
		public vendedorId:"", 
        public vendedorNombre:""
		){            
        this.cliente = new Cliente();
        this.mesa = new Mesa();          
    }
    
    public asignarValores(init?: Partial<Carrito>) {
        Object.assign(this, init);
    }
}

