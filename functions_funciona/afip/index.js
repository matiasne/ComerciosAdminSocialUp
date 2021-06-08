const express = require('express');
const Afip = require('@afipsdk/afip.js');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const isAuth = require('./middleware');
const Busboy = require('../middlewares')
const jwt = require('jsonwebtoken');
let os = require('os')
const saltRounds = 10;
// This is the router which will be imported in our
// api hub (the index.ts which will be sent to Firebase Functions).
let afipRouter = express.Router();

const db = admin.firestore();
// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
afipRouter.post("/registro",Busboy,async (req,res)=>{ 

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

  req.files.forEach(file =>{

    console.log(file.path)
    bucket.upload(file.path, {
      destination: "Afip/"+file.name
    }, function(err, file) {
      if (!err) {
        console.log("OK")
      }
      else{
        console.log(err)
      }
    });
  })


  let data = {
    comercioId:req.fields.comercioId,
    cuit:req.fields.cuit    
  } 

  bcrypt.hash(req.fields.password, saltRounds, (err, hash) => {
    
    if(err)
      return  res.status(500).send(err);

    data.password = hash
    const afipRef = db.collection('afip');
    afipRef.doc(data.comercioId).set(data);

    return  res.status(200).send("Registrado!");
  },err=>{
    return  res.status(500).send(err);
  })
  
    
})


afipRouter.post("/file",async (req,res)=>{  
  //res.status(200).send(req.files);
  return; 
})


afipRouter.post("/login",async (req,res)=>{

  let comercioId = req.body.comercioId;
  let cuit = req.body.cuit;
  let password = req.body.password;

  console.log(comercioId)
  db.collection('afip').doc(comercioId).get().then(doc=>{

    if(doc.exists){
      console.log(doc.data().cuit)

      bcrypt.compare(password, doc.data().password, function(err, result) {

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
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });

})

afipRouter.post("/prueba",Busboy,async (req,res)=>{
  
  const bucket = admin.storage().bucket()

  req.files.forEach(file =>{

    console.log(file.path)
    bucket.upload(file.path, {
      destination: "Afip/"+file.name
    }, function(err, file) {
      if (!err) {
        console.log("OK")
      }
      else{
        console.log(err)
      }
    });
  })
 
   return res.status(400).send("OK");

})

afipRouter.get("/voucherInfo",isAuth,async (req, res) => {     

  await downloadTemp(req.user.comercioId)
      
  db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
   
});

afipRouter.get("/getLastVoucherInfo",isAuth,async (req, res) => {     

  await downloadTemp(req.user.comercioId)
      
  db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
  
});

afipRouter.get("/getLastVoucherNumber",isAuth,async (req, res) => {     

  await downloadTemp(req.user.comercioId)

      db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
    
});

afipRouter.post("/createVoucher",isAuth,async (req, res) => { 
  
  await downloadTemp(req.user.comercioId)
          db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{
        
            if(doc.exists){
                console.log(doc.data().cuit) 
                const afip = new Afip({ CUIT: req.user.cuit, cert:req.user.comercioId+".pem", key:req.user.comercioId+".key", res_folder: os.tmpdir() ,ta_folder:os.tmpdir() });
                //Aca debo obtener el último número de voucher getLastVoucher
                const lastVoucherNumber = await afip.ElectronicBilling.getLastVoucher(1,6); //Devuelve la información del ultimo voucher

                let voucher = {};
                voucher.CantReg = 1;
                voucher.PtoVta = req.body.ptoVta;
                voucher.CbteTipo = req.body.cbteTipo; //6,  // Tipo de comprobante (ver tipos disponibles) 
                voucher.Concepto = req.body.concepto;//1,  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
                voucher.DocTipo = req.body.docTipo;//99, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
                voucher.DocNro = req.body.docNro;//0,  // Número de documento del comprador (0 consumidor final)
                voucher.CbteDesde = lastVoucherNumber +1;// Número de comprobante o numero del primer comprobante en caso de ser mas de uno
                voucher.CbteHasta = lastVoucherNumber +1;// Número de comprobante o numero del último comprobante en caso de ser mas de uno
                voucher.CbteFch = parseInt(req.body.cbteFch.replace(/-/g, ''));//parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
                voucher.ImpTotal = req.body.impTotal;//121, // Importe total del comprobante
                voucher.ImpTotConc = req.body.impTotConc;//0,   // Importe neto no gravado
                voucher.ImpNeto = req.body.impNeto; //100, // Importe neto gravado
                voucher.ImpOpEx = req.body.impOpEx;//0,   // Importe exento de IVA
                voucher.ImpIVA = req.body.impIVA;//21,  //Importe total de IVA
                voucher.ImpTrib = req.body.impTrib;//0,   //Importe total de tributos
                voucher.MonId = req.body.monId;//'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
                voucher.MonCotiz = req.body.monCotiz;//1,     // Cotización de la moneda usada (1 para pesos argentinos)            
                
        console.log(voucher)

                if(req.body.tributos){
                  voucher.Tributos = []
                    req.body.tributos.forEach((trib) => {
                        voucher.Tributos.push(trib)
                    });                   
                }

                if(req.body.iva){
                  voucher.Iva = []
                    req.body.iva.forEach((i) => {
                        voucher.Iva.push(i)
                    });                    
                }   
                
                if(req.body.compradores){
                  voucher.Compradores = []
                    req.body.compradores.forEach((i) => {
                        voucher.Compradores.push(i)
                    });                    
                }   

                if(req.body.opcionales){
                  voucher.Opcionales = []
                    req.body.opcionales.forEach((i) => {
                        voucher.Opcionales.push(i)
                    });                    
                }  

                if(req.body.cbtesAsoc){
                  voucher.CbtesAsoc = []
                    req.body.cbtesAsoc.forEach((i) => {
                        voucher.CbtesAsoc.push(i)
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
  
});

afipRouter.get("/salesPoint",isAuth,async (req, res) => { 

  await downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
 
});

afipRouter.get("/voucherTypes",isAuth,async (req, res) => { 

  
  await downloadTemp(req.user.comercioId)

  db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
  
 
});

afipRouter.get("/conceptTypes",isAuth,async (req, res) => { 

  await downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
  
 
});

afipRouter.get("/documentTypes",isAuth,async (req, res) => { 
  await downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
     
});

afipRouter.get("/aloquotTypes",isAuth,async (req, res) => { 
  
  await downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
});

afipRouter.get("/currenciesTypes",isAuth,async (req, res) => { 
  await downloadTemp(req.user.comercioId)

        db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
  
});

afipRouter.get("/optionTypes",isAuth,async (req, res) => { 
  await downloadTemp(req.user.comercioId)

  db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{

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
     
});

afipRouter.get("/taxTypes",isAuth,async (req, res) => { 
  await downloadTemp(req.user.comercioId)
      
  db.collection('afip').doc(req.user.comercioId).get().then(async (doc)=>{
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
   
});

downloadTemp = async (comercioId)=>{

     
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

module.exports = afipRouter