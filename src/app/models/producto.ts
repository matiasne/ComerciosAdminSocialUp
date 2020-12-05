import { GrupoOpciones } from './grupoOpciones';
import { Opcion } from './opcion';
import { OpcionSeleccionada } from './opcionSeleccionada';

export class Producto {

    public id="";
    public nombre = "";
    public barcode="";
    public precio = 0;
    public precioTotal = 0;
    public promocion="";
    public destacado = false;
    public unidad="";
    public valorPor = 0;
    public stock = 0;
    public descripcion="";
    public categorias=[];
    public foto="";
    public createdAt=""; 
    public cantidad =0;
    public descripcion_venta="";
    public recibirPedidos=true;
    public gruposOpciones:GrupoOpciones[];
    public opcionesSeleccionadas =[];
    public keywords = [];

	public constructor() {
        this.gruposOpciones = [];
        this.opcionesSeleccionadas =[];
    }

    public asignarValores(init?: Partial<Producto>) {
        Object.assign(this, init);
    }
    
    
}