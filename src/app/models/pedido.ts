import { Producto } from './producto';
import { Comercio } from './comercio';

export class Pedido{

    public comercioId ="";
    
    public on = false;
    public cliente = {
        id:"",
        nombre:"",
        posicion:"",
        telefono:"",
        direccion:"",
        piso:"",
        puerta:""
    }
   
    public estado = 0;
    public recibido = 0;
    public cantidadTotal = 0;
    public total:number = 0;
    public ordenes = [];  
    public productos =[]; 
    
	constructor(){
    }

    public asignarValores(init?: Partial<Pedido>) {
        Object.assign(this, init);
    }

    public setClientName(name){
        this.cliente.nombre = name;
    }

    public setPosition(posicion){
        this.cliente.posicion = posicion;
    }

    public setDireccion(direccion){
        this.cliente.direccion = direccion;
    }

    public setPiso(piso){
        this.cliente.piso = piso;
    }

    public setPuerta(puerta){
        this.cliente.puerta = puerta;
    }
    public setPhone(phone){
        this.cliente.telefono = phone;
    }

    public eliminarOrden(comercioIndex,Productoindex){
        var totalARestar = 0;
        var cantidadMenos= 0;

        console.log(comercioIndex+" "+Productoindex);
        console.log(this.ordenes[comercioIndex].productos[Productoindex]);
        var producto = this.ordenes[comercioIndex].productos[Productoindex];
        totalARestar += (Number(producto.precio) * Number(producto.cantidad));
        cantidadMenos += producto.cantidad;
        

        this.cantidadTotal -= cantidadMenos;
        this.total -= totalARestar;
        this.ordenes[comercioIndex].productos.splice(Productoindex,1);  
        
        if(this.cantidadTotal == 0){
            this.on = false;
        }
    }
    
    public agregarOrden(comercio,producto){
        //Aca revisar si el comercio ya está en ordenes y sumarle a productos de ser así
        comercio.icon = "";
        comercio.portada ="";        
        var agregado = false;
        this.cantidadTotal += producto.cantidad;

        this.total += Number(producto.precio) * Number(producto.cantidad);

        console.log("total: "+this.total);

        this.ordenes.forEach((orden, index)  =>{
            
                if(orden.comercioId == comercio.id){ 
                
                    var sumado = false;
                    orden.productos.forEach((p,index)=>{
                        console.log(p)
                        if(p.id == producto.id){
                            p.cantidad += producto.cantidad;
                            orden.total += p.cantidad * p.precio;
                            sumado = true;
                        }
                    });
    
                    if(!sumado){
                        let objCopy = Object.assign({}, producto);
                        orden.total += objCopy.cantidad * objCopy.precio;
                        orden.productos.push(objCopy);
                    }
                    agregado = true;
                }
                      
        });

        if(!agregado){
            let prodCopy = Object.assign({}, producto);
            prodCopy.portada ="";                    
            
            var o = {
                comercioId: comercio.id,
                comercioNombre: comercio.nombre,
                comercioTelefono: comercio.telefono,
                productos: [prodCopy],   
                total:this.total      
            }
            
            this.ordenes.push(o);
        }
    }
}