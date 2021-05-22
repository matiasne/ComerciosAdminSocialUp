const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors');
const express = require('express');
const afipApi = require('./afip')
const woocommerceApi = require('./woocommerce')

const axios = require('axios')

const app = express();

app.use(cors({origin: true})) 
app.use("/afip", afipApi);
app.use("/woocommerce", woocommerceApi);

app.get('/prueba', (request, response) => {
    response.send('Hello from prueba');
});

// HTTP Cloud Functions
const api = functions.https.onRequest(app);

const db = admin.firestore();

var tokenWordpress=""


const getToken = functions.https.onRequest((req, res) => {
    const uid = 'some-uid';   
    //ACa puede buscar en la base de datos al comericio, dentro del mismo estara el usuario y contraseña para el servicio
    //con el id generar el token
    res.status(200).send({token: jwt.sign(uid, "SecretClave123432")});
    return null
    
});

const validarToken = functions.https.onRequest((req, res) => {   

    const token = req.get('Authorization').split('Bearer ')[1];

    jwt.verify(token, "SecretClave123432", (err, data) => {
        console.log(data)
        if(data){
            if(data === "some-uid")
                res.status(200).send("Tiene Permiso");
            else    
                res.status(404).send("No valido");
        }
        if(err){
            res.status(404).send("No valido");
        }
    }) 
    
});


const onUserStatusChanged = functions.database.ref('/users/{uid}').onUpdate(
    async (change, context) => {
      // Get the data written to Realtime Database
      const eventStatus = change.after.val();
  
      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      const userStatusFirestoreRef = db.doc(`users/${context.params.uid}`);
  
      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once('value');
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }
  
      // Otherwise, we convert the last_changed field to a Date
      eventStatus.last_changed = new Date(eventStatus.last_changed);
  
      // ... and write it to Firestore.
      return userStatusFirestoreRef.update(eventStatus);
});
  


const syncProductoWithWCCollection = functions.firestore.document('/comercios/{comercioId}/productos/{productoId}/woocommerceSincData/{id}').onWrite((change, context) => {

    db.collection('comercios/'+context.params.comercioId+'/woocommerceSincData').doc("1").get().then(comercioSincDataDoc=>{
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

            axios.post(comercioSincDataDoc.data().url+"/wp-json/jwt-auth/v1/token",data,config)
            .then(response => {

                if(change.after.exists){  //Nuevo o actualizacion
               
                    db.collection('comercios/'+context.params.comercioId+'/productos').doc(context.params.productoId).get().then(productoDoc=>{
                    
                        let producto = productoDoc.data();
                        producto.id = productoDoc.id
                        
                        tokenWordpress = response.data.token
                        
                        
                        console.log("Comercio sincronizado con woocommerce")
                        
                    
                            
                            const newValue = change.after.data()||{};
                            // ...the previous value before this update
                            const previousValue = change.before.data()||{};                  
                                
                            
                            
                            console.log(newValue.sincronizado+" "+previousValue.sincronizado)
                                                
        
                            if(newValue.sincronizado){ 
        
                                if(previousValue.sincronizado){ //Actualizamos

                                    WooUpdateProducto(comercioSincData,producto,newValue.id)  
                                        
                                }
                                else{ //creamos 

                                    WooCrearProducto(comercioSincData,producto,change)
                                }                            
                            }
                            else{ //newValue.id no existe

                                if(previousValue.sincronizado){
                                    
                                    WooDeleteProducto(comercioSincData,newValue.id)
                                
                                }
                                else{                                
                                    console.log("Woocommerce sincronizado permanece en false")                            
                                }    
                            }
                            
                        
                            
                        
                    return null;
                    }).catch((err) => {console.log(err)});
                }
                else{
    
                    const previousValue = change.before.data()||{};
    
                    if(previousValue.id){
                
                        WooDeleteProducto(comercioSincData,previousValue.id)
                    }     
                }
            return null
            }).catch((err) => {console.log(err)});
            
        } 
        else{
            console.log("Conexión no establecida")   
        }    
             
        return null
    }).catch((err) => {console.log(err)}); 

    console.log("Sincronización en curso...");   
    return "OK"
})



const syncCategoriasWithWC = functions.firestore.document('/comercios/{comercioId}/categorias/{categoriaId}/woocommerceSincData/{id}').onWrite((change, context) => {


    db.collection('comercios/'+context.params.comercioId+'/woocommerceSincData').doc("1").get().then(comercioSincDataDoc=>{
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

            axios.post(comercioSincDataDoc.data().url+"/wp-json/jwt-auth/v1/token",data,config)
            .then(response => {
                    
                tokenWordpress = response.data.token
                console.log(tokenWordpress)
                
                if(change.after.exists){  //Nuevo o actualizacion

                    db.collection('comercios/'+context.params.comercioId+'/categorias').doc(context.params.categoriaId).get().then(categoriaDoc=>{
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
                                WooUpdateCategoria(comercioSincData,categoria,newValue.id)
                            }
                            else{ //creamos 
                                console.log("!!!!!!")
                                WooCrearCategoria(comercioSincData,categoria,change)                                
                            }                            
                        }
                        else{ //newValue.id no existe
                            if(previousValue.sincronizado){                                
                                WooDeleteCategoria(comercioSincData,newValue.id)                            
                            }
                            else{                                
                                console.log("Woocommerce sincronizado permanece en false")                            
                            }    
                        }
                            
                            
                        
                            
                    return null
                    }).catch((err) => {console.log(err)});
                        
                }
                else{
                    const previousValue = change.before.data()||{};
                    if(previousValue.id){                    
                        WooDeleteCategoria(comercioSincData,previousValue.id)
                    }     
                }  
            return null;
            }).catch((err) => {console.log(err)});
        }    
        else{
            console.log("Conexión no establecida")   
        }           
        return null
    }).catch((err) => {console.log(err)}); 

    console.log("Sincronización en curso...");   
    return "OK"

})

WooDeleteCategoria = (comercioSincData,wooId)=>{

    console.log("Borrando categoria de woocommerce"+wooId)
    config = {
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+tokenWordpress
        }
    }                                    

    let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/categories/"+wooId+"?force=true&consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

    axios.delete(apiUrl,config).then(response=>{
        console.log("categoria borrado!")
        return null
    }).catch(err => console.log(err));
}

WooDeleteProducto = (comercioSincData,wooId) =>{

    console.log("Borrando producto de woocommerce"+wooId)
    config = {
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+tokenWordpress
        }
    }                                    

    let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/"+wooId+"?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

    axios.delete(apiUrl,config).then(response=>{
        console.log("producto borrado!")
        return null
    }).catch(err => console.log(err));
}

WooUpdateCategoria = (comercioSincData,categoria,wooId)=>{

    let wcCategoria ={
        name : categoria.nombre,
        description : categoria.descripcion,
        
    }    

    if(categoria.foto){
        wcCategoria.image = {
            src:categoria.foto.url                            
        } 
    }

    console.log("Actualizando en WC: "+wooId)
    config = {
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+tokenWordpress
        }
    }             

    const categoriaJSON = JSON.parse(JSON.stringify(wcCategoria));

    let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/categories/"+wooId+"?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

    axios.post(apiUrl,categoriaJSON,config).then(response=>{
        console.log(response.data.id)
        return null            
    }).catch(err => {

        console.log(err.response.data)
        if(err.response.data.code === "woocommerce_rest_categorie_invalid_id"){
            WooCreateCategoria(comercioSincData,newValue)
            
        }
        return null
        
    });   
}

WooUpdateProducto = (comercioSincData,producto,wooId)=>{

    let wcProducto ={
        name : producto.nombre,
        regular_price : producto.precio.toString(),
        description : producto.descripcion,
        price : producto.promocion.toString(),
        sku : producto.barcode,
        stock_quantity : producto.stock.toString(),
        manage_stock:true,
        categories:[],
        images:[]
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

    console.log("Actualizando en WC: "+wooId)
    config = {
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+tokenWordpress
        }
    }             

    const productoJSON = JSON.parse(JSON.stringify(wcProducto));

    let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/"+wooId+"?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

    axios.post(apiUrl,productoJSON,config).then(response=>{

        db.collection('comercios/'+comercioSincData.comercioId+'/productos').doc(categoria.id).set({woocommerceId:response.data.id}, {merge: true}).then(data=>{
            return null    
        }).catch(err=>{
            console.log(err)
        })

        return null            
    }).catch(err => {
        console.log(err)
    //    if(err.response.data.code === "woocommerce_rest_product_invalid_id"){            
            WooCrearProducto(comercioSincData,producto)
    //    }
        return null
    });


}

WooCrearCategoria = (comercioSincData,categoria,change)=>{

    let wcCategoria ={
        name : categoria.nombre,
        description : categoria.descripcion        
    }    

    if(categoria.foto){
        wcCategoria.image = {
            src:categoria.foto.url                            
        } 
    }

    console.log("Creando en WC (no habia previous)")              
    config = {
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+tokenWordpress
        }
    }                             
    const categoriaJSON = JSON.parse(JSON.stringify(wcCategoria));


    let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products/categories?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

    axios.post(apiUrl,categoriaJSON,config).then(response=>{                                    
        change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});
        db.collection('comercios/'+comercioSincData.comercioId+'/categorias').doc(categoria.id).set({woocommerceId:response.data.id}, {merge: true}).then(data=>{
            return null    
        }).catch(err=>{
            console.log(err)
        })
        return null                
    }).catch(err => console.log(err));
}

WooCrearProducto = (comercioSincData,producto,change)=>{

    let wcProducto ={
        name : producto.nombre,
        regular_price : producto.precio.toString(),
        description : producto.descripcion,
        price : producto.promocion.toString(),
        sku : producto.barcode,
        stock_quantity : producto.stock.toString(),
        manage_stock:true,
        categories:[],
        images:[]
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
    config = {
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer '+tokenWordpress
        }
    }                             
    const productoJSON = JSON.parse(JSON.stringify(wcProducto));

    let apiUrl = comercioSincData.url+"/wp-json/wc/v3/products?consumer_key="+comercioSincData.consumerKey+"&consumer_secret="+comercioSincData.consumerSecret

    axios.post(apiUrl,productoJSON,config).then(response=>{                                    
        change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});
        return null                
    }).catch(err => console.log(err));
}




    
  
  
module.exports = {
    api,
    getToken,
    validarToken,
    onUserStatusChanged,
    syncProductoWithWCCollection,
    syncCategoriasWithWC

};