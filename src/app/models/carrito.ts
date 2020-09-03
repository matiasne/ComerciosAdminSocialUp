import { Producto } from './producto';
import { Servicio } from './servicio';
import { Pagare } from './pagare';
import { Cliente } from './cliente';
import { ComandasService } from '../Services/comandas.service';
import { Comanda } from './comanda';
import { MovimientoCtaCorriente } from './movimientoCtaCorriente';

export class Carrito{

    public totalProductos=0;
    public totalServicios=0;
    public cajaId="";
    public ctaCorrienteId="";
    public metodoPago="";
    public on=false;
    public productos:Producto[] = [];
    public servicios:Servicio[] = [];
    public pagare:Pagare;
    public deposito:MovimientoCtaCorriente;
    public cliente:Cliente;
    public comandaId ="";
    public pedido ="";
	constructor(
		public vendedorId:"", 
        public vendedorNombre:""
		){
            this.pagare = new Pagare();
            this.cliente = new Cliente();
            this.deposito = new MovimientoCtaCorriente(this.vendedorId,this.vendedorNombre);
          
	}
}

