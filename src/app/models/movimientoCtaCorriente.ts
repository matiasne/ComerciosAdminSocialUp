export class MovimientoCtaCorriente{

    public id="";
    public cajaId =""; 
    public clienteId="";
    public ctaCorrienteId="";
    public ventaId ="";
    public servicioId="";
    public motivo="";
    public monto=0;
    public metodoPago ="";
    public createdAt="";
    public pagoId="";

	constructor(
		public vendedorId:"", 
        public vendedorNombre:""
		){

    }
    
    public asignarValores(init?: Partial<MovimientoCtaCorriente>) {
        Object.assign(this, init);
    }
}