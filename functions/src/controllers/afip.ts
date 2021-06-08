import { AfipVoucher, IvaItem, TributoItem } from "../models/afipVoucher";
import * as admin from 'firebase-admin';
import {  Response } from "express";

let os = require('os')
const Afip = require('@afipsdk/afip.js');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const bcrypt = require('bcrypt');
//const path = require('path');
//const fs = require('fs');

export class AfipController {

    constructor() {

    }

    prueba(req:any,res:Response,db:FirebaseFirestore.Firestore){

     console.log(req.fields)     
    console.log( req.files );
    
     return res.status(200).send("Registrado!");
    }
  
    async registro(req:any,res:any,db:FirebaseFirestore.Firestore){     

      if(!req.fields.comercioId){
        res.status(400).send({message:"Falta comercio id"});
        return null;
      }
    
      if(!req.fields.cuit){
        res.status(400).send({message:"Falta cuit"});
        return null;
      }
    
      if(!req.fields.password){
        res.status(400).send({message:"Falta password"});
        return null;
      }
    
      if(req.files.length == 0){
        res.status(400).send({message:"Falta archivos"});
        return null;
      }
      
      const bucket = admin.storage().bucket()
    
      req.files.forEach((file:any) =>{
    
        console.log(file.path)
        bucket.upload(file.path, {
          destination: "Afip/"+file.name
        }, function(err, file) {
          if (!err) {
            console.log("OK")
          }
          else{
            console.log(err)
            return  res.status(200).send("");    
          }
        });
      })
    
    
      let data = {
        comercioId:req.fields.comercioId,
        cuit:req.fields.cuit,
        password:""    
      } 
    
      await bcrypt.hash(req.fields.password, saltRounds, (err:any, hash:any) => {
        
        if(err)
          return  res.status(500).send(err);
    
        data.password = hash
        const afipRef = db.collection('afip');
        afipRef.doc(data.comercioId).set(data);
    
        return  res.status(200).send("Registrado!");
      },(err:any)=>{
        return  res.status(500).send(err);
      })       
         
      return true;   
    }

    login(req:any,res:any,db:FirebaseFirestore.Firestore){

        let comercioId = req.body.comercioId;
        let password = req.body.password;
      
        console.log(comercioId)
        db.collection('afip').doc(comercioId).get().then((doc:any)=>{
      
          if(doc.exists){
            console.log(doc.data().cuit)
      
            bcrypt.compare(password, doc.data().password, function(err:any, result:any) {
      
              console.log(err)
              if(err !== undefined)
                return  res.status(500).send(err);
      
              if(result){     
                let token = jwt.sign({cuit:doc.data().cuit,comercioId:doc.data().comercioId}, "claveSecretaDelToken");     
                return res.status(200).send({token:token});
              }
              else{
                return res.status(303).send("No autorizado");
              }
      
                
            })
          }
          else{
            return res.status(400).send("Comercio no existe");
            return null
          }     
          return null
        }).catch(err=>{
          return  res.status(500).send(err);
        });
    }
      

    async downloadTemp(comercioId:string){

     
      const bucket = admin.storage().bucket();
      try{
        await bucket.file('Afip/'+comercioId+'.key').download({ destination: os.tmpdir()+'/'+comercioId+'.key',validation: false });
      }
      catch(err){
        console.log(err)
      }

      try{
        await bucket.file('Afip/'+comercioId+'.pem').download({ destination: os.tmpdir()+'/'+comercioId+'.pem',validation: false });
      }
      catch(err){
        console.log(err) 
      }
      
      console.log('Files downloaded to Temp');       
    
    }

    async status(req:any,res:any,db:FirebaseFirestore.Firestore){

        await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const serverStatus = await afip.ElectronicBilling.getServerStatus();
              console.log('Este es el estado del servidor:');
              return res.status(200).send(serverStatus); 
            }
            else{
              return res.status(400).send("Comercio no existe");
            }
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          }); 
    }

    async voucherInfo(req:any,res:any,db:FirebaseFirestore.Firestore){
         await this.downloadTemp(req.user.comercioId)
      
        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(1,1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
              try{
                  if(voucherInfo === null){
                      console.log('El comprobante no existe');
                      return res.status(400).send('El comprobante no existe');
                  }
                  else{
                      console.log('Esta es la información del comprobante:');
                      console.log(voucherInfo);
                      return res.status(200).send({voucher:voucherInfo});
                  }
              }catch(err){
                  return res.status(404).send(err);
              }  	
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });  
    }

    async getLastVoucherNumber(req:any,res:any,db:FirebaseFirestore.Firestore){

        await this.downloadTemp(req.user.comercioId)
      
        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data()) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const voucherInfo = await afip.ElectronicBilling.getLastVoucher(1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
              try{
                  if(voucherInfo === null){
                      console.log('El comprobante no existe');
                      return res.status(400).send('El comprobante no existe');
                  }
                  else{
                      console.log('Esta es la información del comprobante:');
                      console.log(voucherInfo);
                      return res.status(200).send({voucher:voucherInfo});
                  }
              }catch(err){
                  return res.status(404).send(err);
              }  	     
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
          },err=>{
            console.log(err)
            return res.status(500).send(err);
          }).catch(err=>{
            console.log(err)
            return res.status(500).send(err);
          }); 
    }

    async getLastVoucherInfo(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

      db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

        if(doc.exists){
          console.log(doc.data().cuit) 
          const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
          
          console.log(afip)
          const numero = await afip.ElectronicBilling.getLastVoucher(1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
          const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(numero,1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
          try{
              if(voucherInfo === null){
                  console.log('El comprobante no existe');
                  return res.status(400).send('El comprobante no existe');
              }
              else{
                  console.log('Esta es la información del comprobante:');
                  console.log(voucherInfo);
                  return res.status(200).send({voucher:voucherInfo});
              }
          }catch(err){
              return res.status(404).send(err);
          }  	     
        }
        else{
          return res.status(400).send("Comercio no existe");
        }    
      },err=>{
        return res.status(500).send(err);
      }).catch(err=>{
        return res.status(500).send(err);
      });   
    }

    async createVoucher(req:any,res:any,db:FirebaseFirestore.Firestore){
          await this.downloadTemp(req.user.comercioId)
          db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{
        
            if(doc.exists){
                console.log(doc.data().cuit) 
                const afip = new Afip({ CUIT: req.user.cuit, cert:req.user.comercioId+".pem", key:req.user.comercioId+".key", res_folder: os.tmpdir() ,ta_folder:os.tmpdir() });
                //Aca debo obtener el último número de voucher getLastVoucher
                const lastVoucherNumber = await afip.ElectronicBilling.getLastVoucher(1,6); //Devuelve la información del ultimo voucher

                let voucher:AfipVoucher = new AfipVoucher();
                voucher.CantReg = 1;
                voucher.CbteTipo = req.body.CbteTipo; //6,  // Tipo de comprobante (ver tipos disponibles) 
                voucher.Concepto = req.body.Concepto;//1,  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
                voucher.DocTipo = req.body.DocTipo;//99, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
                voucher.DocNro = req.body.DocNro;//0,  // Número de documento del comprador (0 consumidor final)
                voucher.CbteDesde = lastVoucherNumber +1;// Número de comprobante o numero del primer comprobante en caso de ser mas de uno
                voucher.CbteHasta = lastVoucherNumber +1;// Número de comprobante o numero del último comprobante en caso de ser mas de uno
                voucher.CbteFch = parseInt(req.body.CbteFch.replace(/-/g, ''));//parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
                voucher.ImpTotal = req.body.ImpTotal;//121, // Importe total del comprobante
                voucher.ImpTotConc = req.body.ImpTotConc;//0,   // Importe neto no gravado
                voucher.ImpNeto = req.body.ImpNeto; //100, // Importe neto gravado
                voucher.ImpOpEx = req.body.ImpOpEx;//0,   // Importe exento de IVA
                voucher.ImpIVA = req.body.ImpIVA;//21,  //Importe total de IVA
                voucher.ImpTrib = req.body.ImpTrib;//0,   //Importe total de tributos
                voucher.MonId = req.body.MonId;//'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
                voucher.MonCotiz = req.body.MonCotiz;//1,     // Cotización de la moneda usada (1 para pesos argentinos)            
                
        
                if(req.body.tributos.length > 0){
                    req.body.tributos.forEach((trib:any) => {
                        let tributo = new TributoItem()
                        tributo.asignarValores(trib)
                        voucher.Tributos.push(tributo)
                    });
                    
                }

                if(req.body.iva.length > 0){
                    req.body.iva.forEach((i:any) => {
                        let iva = new IvaItem()
                        iva.asignarValores(i)
                        voucher.Iva.push(iva)
                    });                    
                }              
            
                const respuesta = await afip.ElectronicBilling.createVoucher(voucher);
            
                return res.status(200).send({CAE:respuesta['CAE'],CAEFchVto:respuesta['CAEFchVto']}); 	     
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
          }).catch(err=>{
            console.log("!!!"+err)
            return  res.status(400).send({err:""+err});
          });
          
           //CAE asignado el comprobante
           //Fecha de vencimiento del CAE (yyyy-mm-dd)
    }

    async salesPoint(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const salesPoints= await afip.ElectronicBilling.getSalesPoints();
              return res.status(200).send({salesPoints:salesPoints});	     
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });
    }

    async voucherTypes(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(), ta_folder:os.tmpdir() });
              const voucherTypes = await afip.ElectronicBilling.getVoucherTypes();
              return res.status(200).send({voucherTypes:voucherTypes});	     
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });
    }

    async conceptTypes(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const conceptTypes = await afip.ElectronicBilling.getConceptTypes();
              return res.status(200).send({conceptTypes:conceptTypes});   
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });
    }

    async documentTypes(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const documentTypes  = await afip.ElectronicBilling.getDocumentTypes();
              return res.status(200).send({documentTypes:documentTypes }); 	     
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
            return null
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });
    }

    async aloquotTypes(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const aloquotTypes  = await afip.ElectronicBilling.getAliquotTypes();
              return res.status(200).send({aloquotTypes :aloquotTypes  });   	     
            }
            else{
              return res.status(400).send("Comercio no existe");
            }     
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });
    }

    async currenciesTypes(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const currenciesTypes = await afip.ElectronicBilling.getCurrenciesTypes();
              return res.status(200).send({currenciesTypes :currenciesTypes  });        
            }
            else{
              return res.status(400).send("Comercio no existe");
            }    
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });
    }

    async optionTypes(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{

            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const optionTypes  = await afip.ElectronicBilling.getOptionsTypes();
              return res.status(200).send({optionTypes  :optionTypes   });   
            }
            else{
              return res.status(400).send("Comercio no existe");
            }   
          },err=>{
            return res.status(500).send(err);
            return null
          }).catch(err=>{
            return  res.status(500).send(err);
          });
    }

    async taxTypes(req:any,res:any,db:FirebaseFirestore.Firestore){

      await this.downloadTemp(req.user.comercioId)
      
        db.collection('afip').doc(req.user.comercioId).get().then(async (doc:any)=>{
            if(doc.exists){
              console.log(doc.data().cuit) 
              const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: os.tmpdir(),ta_folder:os.tmpdir() });
              const taxTypes = await afip.ElectronicBilling.getTaxTypes();
              return res.status(200).send({taxTypes :taxTypes});  
            }
            else{
              return res.status(400).send("Comercio no existe");

            }     
          },err=>{
            return res.status(500).send(err);
          }).catch(err=>{
            return res.status(500).send(err);
          });
    }
    
}