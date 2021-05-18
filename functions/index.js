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
  

/*
const syncProductoWithWC = functions.firestore.document('/comercios/{comercioId}/productos/{productoId}').onWrite((change, context) => {

    db.collection('comercios').doc(context.params.comercioId).get().then(comercioDoc=>{
        console.log(comercioDoc.data().woocommerce.url)
        if(comercioDoc.data().woocommerce.url !== ""){

            let config = {
                headers: {
                    'Content-Type' : 'application/json',
                }
            }             

            const data = {
                username:"matiasnegri85@gmail.com",
                password:"Eduardito02"
            }

            axios.post(comercioDoc.data().woocommerce.url+"/wp-json/jwt-auth/v1/token",data,config)
            .then(response => {
                    
                
                let comercio = comercioDoc.data()
                console.log("Comercio sincronizado con woocommerce")
                    
                const document = change.after.exists ? change.after.data() : null; //si hay documento despues entonces no es un delete

                if(change.after.exists){  //Nuevo o actualizacion
                    
                    const newValue = change.after.data()||{};
                    // ...the previous value before this update
                    const previousValue = change.before.data()||{};

                    if(newValue.woocommerce.sincronizado){      
                    
                           
                       let wcProducto ={
                           name : newValue.nombre,
                           regular_price : newValue.precio.toString(),
                           description : newValue.descripcion,
                           price : newValue.promocion.toString(),
                           sku : newValue.barcode,
                           stock_quantity : newValue.stock.toString(),
                           manage_stock:true,
                           categories:[],
                           images:[]
                       }    
                       
                       if(newValue.categorias.length > 0){
                           for(let cat of newValue.categorias){
                                   
                               if(cat.woocommerce){
                                   let categorie = {
                                       id:cat.woocommerce.id,
                                       name:cat.nombre
                                   }
                                   wcProducto.categories.push(categorie)
                               }
                               else{
                                   console.log("Categoria no sincronizada con woocommerce!!!");
                               }                       
                           } 
                       }
   
                       if(newValue.imagenes.length > 0){
                           for(const img of newValue.imagenes){
                               wcProducto.images.push({"src":img.url})
                           } 
                       }
                     
                    console.log(newValue.woocommerce.sincronizado+" "+previousValue.woocommerce.sincronizado)
                                           
   
                    if(newValue.woocommerce.sincronizado){ 
   
                        if(previousValue.woocommerce.sincronizado){ //Actualizamos

                            console.log("Actualizando en WC")
                            config = {
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization' : 'Bearer '+response.data.token
                                }
                            }             
            
                            const productoJSON = JSON.parse(JSON.stringify(wcProducto));
    
                            let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products/"+newValue.woocommerce.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
            
                            axios.post(apiUrl,productoJSON,config).then(response=>{
                                console.log(response.data.id)
                                return null            
                            }).catch(err => {
                                console.log(err.response.data)
                                if(err.response.data.code === "woocommerce_rest_product_invalid_id"){
                                    console.log("Creando en WC")              
                                    config = {
                                        headers: {
                                            'Content-Type' : 'application/json',
                                            'Authorization' : 'Bearer '+response.data.token
                                        }
                                    }             
                    
                                    const productoJSON = JSON.parse(JSON.stringify(wcProducto));
            
                                    let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
                    
                                    axios.post(apiUrl,productoJSON,config).then(response=>{
                                        
                                        change.after.ref.set({woocommerce:{id:response.data.id,sincronizado:true}}, {merge: true});
                                        return null
                    
                                    }).catch(err => console.log(err));
                                    
                                }
                                return null
                                   
                            });        
                                
                        }
                        else{ //creamos 


                            console.log("Creando en WC")              
                            config = {
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization' : 'Bearer '+response.data.token
                                }
                            }             
            
                            const productoJSON = JSON.parse(JSON.stringify(wcProducto));
    
                            let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
            
                            axios.post(apiUrl,productoJSON,config).then(response=>{
                                
                                change.after.ref.set({woocommerce:{id:response.data.id,sincronizado:true}}, {merge: true});
                                return null
            
                            }).catch(err => console.log(err));
                            console.log(err.data.data.code)
                        }
                           
                           //}
                    }
                    else{ //newValue.woocommerce.id no existe

                        if(previousValue.woocommerce.sincronizado){
                            
                            console.log("Borrando producto de woocommerce"+previousValue.woocommerce.id)
                            config = {
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization' : 'Bearer '+response.data.token
                                }
                            }                                    
        
                            let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products/"+previousValue.woocommerce.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
    
                            axios.delete(apiUrl,config).then(response=>{
                                console.log("producto borrado!")
                                return null
                            }).catch(err => console.log(err));
                            return null
                        
                        }
                        else{
                            
                           console.log("Woocommerce sincronizado permanece en false")
                           
                       }    
                    }
                }
                else{

                    const previousValue = change.before.data()||{};

                    if(previousValue.woocommerce.id){
                   
                        console.log("Borrando producto de woocommerce"+previousValue.woocommerce.id)
                        config = {
                            headers: {
                                'Content-Type' : 'application/json',
                                'Authorization' : 'Bearer '+response.data.token
                            }
                        }                                    
    
                        let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products/"+previousValue.woocommerce.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret

                        axios.delete(apiUrl,config).then(response=>{
                            console.log("producto borrado!")
                            return null
                        }).catch(err => console.log(err));
                        return null
                    }     
                }
            }      
               
                
            return null;
            }).catch((err) => {
                console.log(err)
            });
        } 
            
        return null
    }).catch((err) => {
        console.log(err)
    }); 
    console.log("Sincronización en curso...");   
    return "OK"
})*/



const syncProductoWithWCCollection = functions.firestore.document('/comercios/{comercioId}/productos/{productoId}/woocommerceSincData/1').onWrite((change, context) => {

    db.collection('comercios').doc(context.params.comercioId).get().then(comercioDoc=>{
        console.log(comercioDoc.data().nombre)
        if(comercioDoc.data().woocommerce.url !== ""){

            db.collection('comercios/'+context.params.comercioId+'/productos').doc(context.params.productoId).get().then(productoDoc=>{
                console.log(productoDoc.data().nombre)
                let producto = productoDoc.data();
                producto.id = productoDoc.id

                let config = {
                    headers: {
                        'Content-Type' : 'application/json',
                    }
                }             

                const data = {
                    username:"matiasnegri85@gmail.com",
                    password:"Eduardito02"
                }

                axios.post(comercioDoc.data().woocommerce.url+"/wp-json/jwt-auth/v1/token",data,config)
                .then(response => {
                        
                    
                    let comercio = comercioDoc.data()
                    console.log("Comercio sincronizado con woocommerce")
                        
                    const document = change.after.exists ? change.after.data() : null; //si hay documento despues entonces no es un delete

                    if(change.after.exists){  //Nuevo o actualizacion
                        
                        const newValue = change.after.data()||{};
                        // ...the previous value before this update
                        const previousValue = change.before.data()||{};

                        if(newValue.sincronizado){      
                        
                            
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
                                
                                if(cat.woocommerce){
                                    let categorie = {
                                        id:cat.woocommerceId,!!!! ver que se guarde
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
                        
                        console.log(newValue.sincronizado+" "+previousValue.sincronizado)
                                            
    
                        if(newValue.sincronizado){ 
    
                            if(previousValue.sincronizado){ //Actualizamos

                                console.log("Actualizando en WC: "+previousValue.id)
                                config = {
                                    headers: {
                                        'Content-Type' : 'application/json',
                                        'Authorization' : 'Bearer '+response.data.token
                                    }
                                }             
                
                                const productoJSON = JSON.parse(JSON.stringify(wcProducto));
        
                                let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products/"+newValue.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
                
                                axios.post(apiUrl,productoJSON,config).then(response=>{
                                    console.log(response.data.id)
                                    return null            
                                }).catch(err => {

                                    console.log(err.response.data)
                                    if(err.response.data.code === "woocommerce_rest_product_invalid_id"){
                                        console.log("Creando en WC")              
                                        config = {
                                            headers: {
                                                'Content-Type' : 'application/json',
                                                'Authorization' : 'Bearer '+response.data.token
                                            }
                                        }             
                        
                                        const productoJSON = JSON.parse(JSON.stringify(wcProducto));
                
                                        let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
                        
                                        axios.post(apiUrl,productoJSON,config).then(response=>{
                                            console.log(response.data.id)
                                            change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});

                                            
                                            return null
                        
                                        }).catch(err => console.log(err));
                                        
                                    }
                                    return null
                                    
                                });        
                                    
                            }
                            else{ //creamos 

                                console.log("Creando en WC (no habia previous)")              
                                config = {
                                    headers: {
                                        'Content-Type' : 'application/json',
                                        'Authorization' : 'Bearer '+response.data.token
                                    }
                                }                             
                                const productoJSON = JSON.parse(JSON.stringify(wcProducto));
        
                                let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
                
                                axios.post(apiUrl,productoJSON,config).then(response=>{                                    
                                    change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});
                                    return null                
                                }).catch(err => console.log(err));
                            }                            
                        }
                        else{ //newValue.id no existe

                            if(previousValue.sincronizado){
                                
                                console.log("Borrando producto de woocommerce"+previousValue.id)
                                config = {
                                    headers: {
                                        'Content-Type' : 'application/json',
                                        'Authorization' : 'Bearer '+response.data.token
                                    }
                                }                                    
            
                                let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products/"+previousValue.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
        
                                axios.delete(apiUrl,config).then(response=>{
                                    console.log("producto borrado!")
                                    return null
                                }).catch(err => console.log(err));
                                return null
                            
                            }
                            else{                                
                                console.log("Woocommerce sincronizado permanece en false")                            
                            }    
                        }
                    }
                    else{

                        const previousValue = change.before.data()||{};

                        if(previousValue.id){
                    
                            console.log("Borrando producto de woocommerce"+previousValue.id)
                            config = {
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization' : 'Bearer '+response.data.token
                                }
                            }                                    
        
                            let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/products/"+previousValue.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret

                            axios.delete(apiUrl,config).then(response=>{
                                console.log("producto borrado!")
                                return null
                            }).catch(err => console.log(err));
                        }     
                    }
                }           
                    
                return null;
                }).catch((err) => {console.log(err)});
            return null
            }).catch((err) => {console.log(err)});
        }             
        return null
    }).catch((err) => {console.log(err)}); 

    console.log("Sincronización en curso...");   
    return "OK"
})



const syncCategoriasWithWC = functions.firestore.document('/comercios/{comercioId}/categorias/{categoriaId}/woocommerceSincData/1').onWrite((change, context) => {


    db.collection('comercios').doc(context.params.comercioId).get().then(comercioDoc=>{
        console.log(comercioDoc.data().nombre)
        if(comercioDoc.data().woocommerce.url !== ""){

            db.collection('comercios/'+context.params.comercioId+'/categorias').doc(context.params.categoriaId).get().then(categoriaDoc=>{
                console.log(categoriaDoc.data().nombre)
                let categoria = categoriaDoc.data();
                categoria.id = categoriaDoc.id

                let config = {
                    headers: {
                        'Content-Type' : 'application/json',
                    }
                }             

                const data = {
                    username:"matiasnegri85@gmail.com",
                    password:"Eduardito02"
                }

                axios.post(comercioDoc.data().woocommerce.url+"/wp-json/jwt-auth/v1/token",data,config)
                .then(response => {
                        
                    
                    let comercio = comercioDoc.data()
                    console.log("Comercio sincronizado con woocommerce")
                        
                    const document = change.after.exists ? change.after.data() : null; //si hay documento despues entonces no es un delete

                    if(change.after.exists){  //Nuevo o actualizacion
                        
                        const newValue = change.after.data()||{};
                        // ...the previous value before this update
                        const previousValue = change.before.data()||{};

                        if(newValue.sincronizado){      
                        
                            
                        let wcCategoria ={
                            name : newValue.nombre,
                            description : newValue.descripcion,
                            image: {
                                src:newValue.foto.url                            
                            } 
                        }    
                        
                        
                        console.log(newValue.sincronizado+" "+previousValue.sincronizado)
                                            
    
                        if(newValue.sincronizado){ 
    
                            if(previousValue.sincronizado){ //Actualizamos

                                console.log("Actualizando en WC: "+previousValue.id)
                                config = {
                                    headers: {
                                        'Content-Type' : 'application/json',
                                        'Authorization' : 'Bearer '+response.data.token
                                    }
                                }             
                
                                const categoriaJSON = JSON.parse(JSON.stringify(wcCategoria));
        
                                let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/categories/"+newValue.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
                
                                axios.post(apiUrl,categoriaJSON,config).then(response=>{
                                    console.log(response.data.id)
                                    return null            
                                }).catch(err => {

                                    console.log(err.response.data)
                                    if(err.response.data.code === "woocommerce_rest_categorie_invalid_id"){
                                        console.log("Creando en WC")              
                                        config = {
                                            headers: {
                                                'Content-Type' : 'application/json',
                                                'Authorization' : 'Bearer '+response.data.token
                                            }
                                        }             
                        
                                        const categoriaJSON = JSON.parse(JSON.stringify(wcCategoria));
                
                                        let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/categories?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
                        
                                        axios.post(apiUrl,categoriaJSON,config).then(response=>{
                                            console.log(response.data.id)
                                            change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});
                                            
                                            return null
                        
                                        }).catch(err => console.log(err));
                                        
                                    }
                                    return null
                                    
                                });        
                                    
                            }
                            else{ //creamos 

                                console.log("Creando en WC (no habia previous)")              
                                config = {
                                    headers: {
                                        'Content-Type' : 'application/json',
                                        'Authorization' : 'Bearer '+response.data.token
                                    }
                                }                             
                                const categoriaJSON = JSON.parse(JSON.stringify(wcCategoria));
        
                                let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/categories?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
                
                                axios.post(apiUrl,categoriaJSON,config).then(response=>{                                    
                                    change.after.ref.set({id:response.data.id,sincronizado:true,createdAt:new Date()}, {merge: true});
                                    
                                    return null                
                                }).catch(err => console.log(err));
                            }                            
                        }
                        else{ //newValue.id no existe

                            if(previousValue.sincronizado){
                                
                                console.log("Borrando categoria de woocommerce"+previousValue.id)
                                config = {
                                    headers: {
                                        'Content-Type' : 'application/json',
                                        'Authorization' : 'Bearer '+response.data.token
                                    }
                                }                                    
            
                                let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/categories/"+previousValue.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret
        
                                axios.delete(apiUrl,config).then(response=>{
                                    console.log("categoria borrado!")
                                    return null
                                }).catch(err => console.log(err));
                                return null
                            
                            }
                            else{                                
                                console.log("Woocommerce sincronizado permanece en false")                            
                            }    
                        }
                    }
                    else{

                        const previousValue = change.before.data()||{};

                        if(previousValue.id){
                    
                            console.log("Borrando categoria de woocommerce"+previousValue.id)
                            config = {
                                headers: {
                                    'Content-Type' : 'application/json',
                                    'Authorization' : 'Bearer '+response.data.token
                                }
                            }                                    
        
                            let apiUrl = comercioDoc.data().woocommerce.url+"/wp-json/wc/v3/categories/"+previousValue.id+"?consumer_key="+comercio.woocommerce.consumerKey+"&consumer_secret="+comercio.woocommerce.consumerSecret

                            axios.delete(apiUrl,config).then(response=>{
                                console.log("categoria borrado!")
                                return null
                            }).catch(err => console.log(err));
                        }     
                    }
                }           
                    
                return null;
                }).catch((err) => {console.log(err)});
            return null
            }).catch((err) => {console.log(err)});
        }             
        return null
    }).catch((err) => {console.log(err)}); 

    console.log("Sincronización en curso...");   
    return "OK"

})


    
  
  
module.exports = {
    api,
    getToken,
    validarToken,
    onUserStatusChanged,
    syncProductoWithWCCollection,
    syncCategoriasWithWC

};