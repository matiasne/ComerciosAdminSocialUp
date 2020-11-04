import { Servicio } from './servicio';
export class Venta{
    public id ="";
    public total =0;
    public cajaId="";
    public metodoPago="";
    public clienteId="";
    public productos = [];
    public productosId =[];

	constructor(
		public vendedorId:"", 
        public vendedorNombre:""
		){
	}
}