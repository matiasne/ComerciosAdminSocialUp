import { Producto } from './producto';
import { Servicio } from './servicio';
import { Pagare } from './pagare';
import { Cliente } from './cliente';
import { ComandasService } from '../Services/comandas.service';
import { Comanda } from './comanda';
import { MovimientoCtaCorriente } from './movimientoCtaCorriente';
import { Mesa } from './mesa';

export class Carrito{    
    public cliente:Cliente;
    public mesa:Mesa;
    public comandaId ="";
    public pedido ="";

    public on = false;

    public productos:Producto[] = [];
    public servicios:Servicio[] = [];

    public totalProductos=0;
    public totalServicios=0;

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

