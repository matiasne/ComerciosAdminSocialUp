export class MovimientoCaja{

    public id ="";
    public clienteId = "";
    public servicioId ="";
    public cajaId ="";
    public metodoPago ="";    
    public monto=0;
    public motivo="";
    public ventaId="";
    public pagareId ="";
    public ctaCorrienteId ="";    
    public depositoId="";
    public extraccionId="";
    public createdAt = new Date();
    public isCierre = false;
    public isApertura = false;
    public fotoCaja:any; //Estado de la caja al momento de realizar el movimiento

	constructor(
		public vendedorId:"", 
        public vendedorNombre:""
		){
    }
    
    public asignarValores(init?: Partial<MovimientoCaja>) {
        Object.assign(this, init);
    }
}