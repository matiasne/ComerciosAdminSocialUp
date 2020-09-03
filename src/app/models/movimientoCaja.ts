export class MovimientoCaja{

    public id ="";
    public clienteId = "";
    public servicioId ="";
    public cajaId ="";
    public metodoPago ="";    
    public monto=0;
    public ventaId="";
    public pagareId ="";
    public ctaCorrienteId ="";    
    public depositoId="";
    public createdAt = new Date();
    public isCierre = false;

	constructor(
		public vendedorId:"", 
        public vendedorNombre:""
		){
    }
    
    public asignarValores(init?: Partial<MovimientoCaja>) {
        Object.assign(this, init);
    }
}