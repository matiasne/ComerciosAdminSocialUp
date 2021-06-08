
import * as admin from 'firebase-admin';
import {  Response } from "express";

export class WoocommerceWebHook {

    constructor() {

    }

    nuevoPedido = (req:any,res:Response,db:FirebaseFirestore.Firestore)=>{

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
    
        db.collection('comercios/'+req.query.comercioId+"/pedidosWoocommerce").doc(req.body.id.toString()).set(req.body).then((data:any)=>{
    
            console.log("pedidos guardado")    
    
    
            db.collection("comercios/"+req.query.comercioId+"/roles").where("rol","==","Administrador").get().then((querySnapshot) => {
                console.log("rol encontrado")
                querySnapshot.forEach((doc:any) => {
                    console.log(doc.id)
                    db.collection('users').doc(doc.id).get().then((doc:any) => {
                       
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
    }

}