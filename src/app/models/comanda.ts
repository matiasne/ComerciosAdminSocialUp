import { Carrito } from './carrito'

export class Comanda{
	public id="";
	public status=0;
	public clienteId="";
	public clienteEmail="";
	public clienteNombre="";
	public clientePiso="";
	public clienteDireccion= "";
	public clientePuerta= "";
	public clienteTelefono= "";

	public carrito ="";
	public cocinaId ="";
	
	public isPedido= false;

	constructor(
		public empleadoId:"", 
		public empleadoNombre:"",
		public empleadoEmail:""
	) {
	}
	
		
	
}