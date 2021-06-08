import * as functions from 'firebase-functions'

export class WoocommerceSync {
    private tokenWordpress = "";
    constructor(
        private db:any,
        private axios:any){

    }

    
    syncProductoWithWCCollection = functions.firestore.document('/comercios/{comercioId}/productos/{productoId}/woocommerceSincData/{id}').onWrite((change, context) => {

        this.db.collection('comercios/'+context.params.comercioId+'/woocommerceSincData').doc("1").get().then( (comercioSincDataDoc:any)=>{
            console.log(comercioSincDataDoc.data().url)

            if(comercioSincDataDoc.data().isOk === "true"){

                let comercioSincData = comercioSincDataDoc.data()


                let config = {
                    headers: {
                        'Content-Type' : 'application/json',
                    }
                }             

                const data = {
                    username:"matiasnegri85@gmail.com",
                    password:"Eduardito02"
                }

                this.axios.post(comercioSincDataDoc.data().url+"/wp-json/jwt-auth/v1/token",data,config)
                .then((response:any) => {

                    if(change.after.exists){  //Nuevo o actualizacion
                
                        this.db.collection('comercios/'+context.params.comercioId+'/productos').doc(context.params.productoId).get().then((productoDoc:any)=>{
                        
                            let producto = productoDoc.data();
                            producto.id = productoDoc.id
                            
                            this.tokenWordpress = response.data.token
                            
                            
                            console.log("Comercio sincronizado con woocommerce")
                            
                        
                                
                                const newValue = change.after.data()||{};
                                // ...the previous value before this update
                                const previousValue = change.before.data()||{};                  
                                    
                                
                                
                                console.log(newValue.sincronizado+" "+previousValue.sincronizado)
                                                    
            
                                if(newValue.sincronizado){ 
            
                                    if(previousValue.sincronizado){ //Actualizamos

                                        this.WooUpdateProducto(comercioSincData,producto,change)  
                                            
                                    }
                                    else{ //creamos 

                                        this.WooCrearProducto(comercioSincData,producto,change)
                                    }                            
                                }
                                else{ //newValue.id no existe

                                    if(previousValue.sincronizado){
                                        
                                        this.WooDeleteProducto(comercioSincData,newValue.id)
                                    
                                    }
                                    else{                                
                                        console.log("Woocommerce sincronizado permanece en false")                            
                                    }    
                                }
                                
                            
                                
                            
                        return null;
                        }).catch((err:any) => {console.log(err)});
                    }
                    else{
        
                        const previousValue = change.before.data()||{};
        
                        if(previousValue.id){
                    
                            this.WooDeleteProducto(comercioSincData,previousValue.id)
                        }     
                    }
                return null
                }).catch((err:any) => {console.log(err)});
                
            } 
            else{
                console.log("Conexión no establecida")   
            }    
                
            return null
        }).catch((err:any) => {console.log(err)}); 

        console.log("Sincronización en curso...");   
        return "OK"
    })



    syncCategoriasWithWC = functions.firestore.document('/comercios/{comercioId}/categorias/{categoriaId}/woocommerceSincData/{id}').onWrite((change, context) => {


        this.db.collection('comercios/'+context.params.comercioId+'/woocommerceSincData').doc("1").get().then((comercioSincDataDoc:any)=>{
            console.log(comercioSincDataDoc.data().url)
            if(comercioSincDataDoc.data().isOk === "true"){

                let comercioSincData = comercioSincDataDoc.data()

                console.log("Comercio sincronizado con woocommerce")
                let config = {
                    headers: {
                        'Content-Type' : 'application/json',
                    }
                }             

                const data = {
                    username:"matiasnegri85@gmail.com",
                    password:"Eduardito02"
                }

                this.axios.post(comercioSincDataDoc.data().url+"/wp-json/jwt-auth/v1/token",data,config)
                .then((response:any) => {
                        
                    this.tokenWordpress = response.data.token
                    console.log(this.tokenWordpress)
                    
                    if(change.after.exists){  //Nuevo o actualizacion

                        this.db.collection('comercios/'+context.params.comercioId+'/categorias').doc(context.params.categoriaId).get().then((categoriaDoc:any)=>{
                            console.log(categoriaDoc.data().nombre)
                            let categoria = categoriaDoc.data();
                            categoria.id = categoriaDoc.id    
                        
                                    
                            
                            console.log("change after exists")
                            const newValue = change.after.data()||{};
                            // ...the previous value before this update
                            const previousValue = change.before.data()||{};

                            
                                        
                            console.log(newValue.sincronizado+" "+previousValue.sincronizado)                                               

                            if(newValue.sincronizado){    
                                console.log("newValue sincronizado")    
                                if(previousValue.sincronizado){ //Actualizamos
                                   this.WooUpdateCategoria(comercioSincData,categoria,change)
                                }
                                else{ //creamos 
                                    console.log("!!!!!!")
                                    this.WooCrearCategoria(comercioSincData,categoria,change)                                
                                }                            
                            }
                            else{ //newValue.id no existe
                                if(previousValue.sincronizado){                                
                                    this.WooDeleteCategoria(comercioSincData,newValue.id)                            
                                }
                                else{                                
                                    console.log("Woocommerce sincronizado permanece en false")                            
                                }    
                            }
                                
                                
                            
                                
                        return null
                        }).catch((err:any) => {console.log(err)});
                            
                    }
                    else{
                        const previousValue = change.before.data()||{};
                        if(previousValue.id){                    
                            this.WooDeleteCategoria(comercioSincData,previousValue.id)
                        }     
                    }  
                return null;
                }).catch((err:any) => {console.log(err)});
            }    
            else{
                console.log("Conexión no establecida")   
            }           
            return null
        }).catch((err:any) => {console.log(err)}); 

        console.log("Sincronización en curso...");   
        return "OK"

    })

    WooDeleteCategoria = (comercioSincData:any,wooId:any)=>{

        console.log("Borrando categoria de woocommerce"+wooId)
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.tokenWordpress
            }
        }                                    

        let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/categories/"+wooId+"?force=true&consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

        this.axios.delete(apiUrl,config).then((response:any)=>{
            console.log("categoria borrado!")
            return null
        }).catch((err:any) => console.log(err));
    }

    WooDeleteProducto = (comercioSincData:any,wooId:any) =>{

        console.log("Borrando producto de woocommerce"+wooId)
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.tokenWordpress
            }
        }                                    

        let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/"+wooId+"?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

        this.axios.delete(apiUrl,config).then((response:any)=>{
            console.log("producto borrado!")
            return null
        }).catch((err:any) => console.log(err));
    }

    WooUpdateCategoria = (comercioSincData:any,categoria:any,change:any)=>{

        let wcCategoria:any ={
            name : categoria.nombre,
            description : categoria.descripcion,
            
        }    
        wcCategoria.image = []
        if(categoria.foto){
            wcCategoria.image = {
                src:categoria.foto.url                            
            } 
        }

        console.log("Actualizando en WC: "+change.after.data().id)
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.tokenWordpress
            }
        }             

        const categoriaJSON = JSON.parse(JSON.stringify(wcCategoria));

        let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/categories/"+change.after.data().id+"?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

        this.axios.post(apiUrl,categoriaJSON,config).then((response:any)=>{
            console.log(response.data.id)
            return null            
        }).catch((err:any) => {

            console.log(err.response.data)
            if(err.response.data.code === "woocommerce_rest_categorie_invalid_id"){
                this.WooCrearCategoria(comercioSincData,categoria,change)
                console.log("ID incorrecto")
            }
            return null
            
        });   
    }

    WooUpdateProducto = (comercioSincData:any,producto:any,change:any)=>{

        let wcProducto ={
            name : producto.nombre,
            regular_price : producto.precio.toString(),
            description : producto.descripcion,
            price : producto.promocion.toString(),
            sku : producto.barcode,
            stock_quantity : producto.stock.toString(),
            manage_stock:true,
            categories:[{}],
            images:[{}]
        }    

        if(producto.categorias.length > 0){
            for(let cat of producto.categorias){
                
                if(cat.woocommerceId){
                    let categorie = {
                        id:cat.woocommerceId,
                        name:cat.nombre
                    }
                    wcProducto.categories.push(categorie)
                }
                else{
                    console.log("Categoria no sincronizada con woocommerce!!!");
                }                       
            } 
        }

        if(producto.imagenes.length > 0){
            for(const img of producto.imagenes){
                wcProducto.images.push({"src":img.url})
            } 
        }

        console.log("Actualizando en WC: "+change.after.data().id)
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.tokenWordpress
            }
        }             

        const productoJSON = JSON.parse(JSON.stringify(wcProducto));

        let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/"+change.after.data().id+"?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

        this.axios.post(apiUrl,productoJSON,config).then((response:any)=>{

            this.db.collection('comercios/'+comercioSincData.comercioId+'/productos').doc(producto.id).set({woocommerceId:response.data.id}, {merge: true}).then((data:any)=>{
                return null    
            }).catch((err:any)=>{
                console.log(err)
            })

            return null            
        }).catch((err:any) => {
            console.log(err)
        //    if(err.response.data.code === "woocommerce_rest_product_invalid_id"){            
                this.WooCrearProducto(comercioSincData,producto,change)
        //    }
            return null
        });


    }

    WooCrearCategoria = (comercioSincData:any,categoria:any,change:any)=>{

        let wcCategoria ={
            name : categoria.nombre,
            description : categoria.descripcion,
            image:{}  
        }    

        if(categoria.foto){
            wcCategoria.image = {
                "src":categoria.foto.url                            
            } 
        }

        console.log("Creando en WC (no habia previous)")              
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.tokenWordpress
            }
        }                             
        const categoriaJSON = JSON.parse(JSON.stringify(wcCategoria));


        let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/categories?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

        this.axios.post(apiUrl,categoriaJSON,config).then((response:any)=>{                                    
            change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});
            this.db.collection('comercios/'+comercioSincData.comercioId+'/categorias').doc(categoria.id).set({woocommerceId:response.data.id}, {merge: true}).then((data:any)=>{
                return null    
            }).catch((err:any)=>{
                console.log(err)
            })
            return null                
        }).catch((err:any) => console.log(err));
    }

    WooCrearProducto = (comercioSincData:any,producto:any,change:any)=>{

        let wcProducto ={
            name : producto.nombre,
            regular_price : producto.precio.toString(),
            description : producto.descripcion,
            price : producto.promocion.toString(),
            sku : producto.barcode,
            stock_quantity : producto.stock.toString(),
            manage_stock:true,
            categories:[{}],
            images:[{}]
        }    

        if(producto.categorias.length > 0){
            for(let cat of producto.categorias){
                
                if(cat.woocommerceId){
                    let categorie = {
                        id:cat.woocommerceId,
                        name:cat.nombre
                    }
                    wcProducto.categories.push(categorie)
                }
                else{
                    console.log("Categoria no sincronizada con woocommerce!!!");
                }                       
            } 
        }

        if(producto.imagenes.length > 0){
            for(const img of producto.imagenes){
                wcProducto.images.push({"src":img.url})
            } 
        }


        console.log("Creando en WC (no habia previous)")              
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+this.tokenWordpress
            }
        }                             
        const productoJSON = JSON.parse(JSON.stringify(wcProducto));

        let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

        this.axios.post(apiUrl,productoJSON,config).then((response:any)=>{                                    
            change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});
            return null                
        }).catch((err:any) => console.log(err));
    }


}
