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
	public mesaId = "";
	public pedidoId ="";
	public mesaNombre ="";
	public productos = []
	public cocinaId ="";
	public impresa = false;

	constructor(
		public empleadoId:"", 
		public empleadoNombre:"",
		public empleadoEmail:""
	) {
	}
	
		
	
}