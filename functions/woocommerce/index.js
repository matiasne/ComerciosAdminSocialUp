const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
// This is the router which will be imported in our
// api hub (the index.ts which will be sent to Firebase Functions).
let woocommerceRouter = express.Router();
const db = admin.firestore();

woocommerceRouter.post("/NuevoProducto",async (req,res)=>{  

    var prod ={
        nombre:req.body.name,
        precio:req.body.regular_price,
        descripcion:req.body.description,
        promocion:req.body.price,
        barcode:req.body.sku,
        stock:req.body.stock_quantity,
        woocommerce:{
            id: req.body.id,
            lastUpdate:new Date(),
            sincronizado:true
        }
    }
    
    if(req.body.images){
        req.body.images.forEach(foto => {
            let data = {
                url:foto.src,
                createdAt:new Date()
            }
            db.collection('comercios/'+req.query.comercioId+"/productos/"+req.body.id+"/fotos").add(data).then(resp =>{
                console.log("url cargada")
                return null;
            }).catch((err) => {
                console.log(err)
            });  
        });
    }


    db.collection('comercios/'+req.query.comercioId+"/producto").doc(req.body.id.toString()).set(prod).then(data=>{

        console.log("producto guardado")
        db.collection("comercios/"+req.query.comercioId+"/roles").where("rol","==","Administrador").get().then((querySnapshot) => {
            console.log("rol encontrado")
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                db.collection('users').doc(doc.id).get().then(doc => {
                   
                    console.log(doc.data().notificationCelulartoken);

                            
                    var message ={
                        "token" : doc.data().notificationCelulartoken,
                        "notification" : {
                            "body" : "Cargado desde la página web",
                            "title": "Nuevo Producto"
                        }
                    }

                    admin.messaging().send(message)
                    .then((response) => {
                        console.log('Successfully sent message:', response);
                        return res.status(200).send({data:"fcm enviado"});
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                        return res.status(200).send({data:"Error enviando fcm"});
                    });           
                    return null;
                    //return res.status(200).send(response);
                })
                .catch((err) => {
                    return  res.status(500).send(err);
                });          
            });
            return null
            //return res.status(200).send(response);
        })
        .catch((err) => {
            return  res.status(500).send(err);
        });

        return null;
    }).catch((err) => {
        return  res.status(500).send(err);
    });

});

woocommerceRouter.post("/NuevoPedido",async (req,res)=>{  

    if(req.body.status === "processing"){
        req.body["statusCobro"] = 1;           
    }
    else if(req.body.status === "completed"){
        req.body["statusCobro"] = 2 
    }
    else if(req.body.status === "cancelled"){
        req.body["statusCobro"] = 3
    }
    else if(req.body.status === "refunded"){
        req.body["statusCobro"] = 4
    }

    db.collection('comercios/'+req.query.comercioId+"/pedidosWoocommerce").doc(req.body.id.toString()).set(req.body).then(data=>{

        console.log("pedidos guardado")
        db.collection("comercios/"+req.query.comercioId+"/roles").where("rol","==","Administrador").get().then((querySnapshot) => {
            console.log("rol encontrado")
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                db.collection('users').doc(doc.id).get().then(doc => {
                   
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.data().notificationCelulartoken);

                            
                    var message ={
                        "token" : doc.data().notificationCelulartoken,
                        "notification" : {
                            "body" : "Se ha realizado un pedido desde tu página web",
                            "title": "Nuevo Pedido"
                        }
                    }

                    admin.messaging().send(message)
                    .then((response) => {
                        // Response is a message ID string.
                        console.log('Successfully sent message:', response);
                        return res.status(200).send({data:"fcm enviado"});
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                        return res.status(200).send({data:"Error enviando fcm"});
                    });           
                    return null;
                    //return res.status(200).send(response);
                })
                .catch((err) => {
                    return  res.status(500).send(err);
                });          
            });
            return null
            //return res.status(200).send(response);
        })
        .catch((err) => {
            return  res.status(500).send(err);
        });

        return null;
    }).catch((err) => {
        return  res.status(500).send(err);
    });


    

    

})

module.exports = woocommerceRouter