const express = require('express');
const Afip = require('@afipsdk/afip.js');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const isAuth = require('./middleware');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
// This is the router which will be imported in our
// api hub (the index.ts which will be sent to Firebase Functions).
let afipRouter = express.Router();

const db = admin.firestore();
// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
afipRouter.post("/registro",async (req,res)=>{ 

  if(!req.body.comercioId){
    res.status(400).send({message:"Falta comercio id"});
    return null;
  }

  if(!req.body.cuit){
    res.status(400).send({message:"Falta cuit"});
    return null;
  }

  if(!req.body.password){
    res.status(400).send({message:"Falta password"});
    return null;
  }

  let data = {
    comercioId:req.body.comercioId,
    cuit:req.body.cuit    
  } 

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    
    if(err)
      return  res.status(500).send(err);

    data.password = hash
    const afipRef = db.collection('afip');
    afipRef.doc(data.comercioId).set(data);

    return  res.status(200).send("Registrado!");
  },err=>{
    return  res.status(500).send(err);
  }).catch(err=>{
    return  res.status(500).send(err);
  });
  return  res.status(500).send("Error en servidor!");
    
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

afipRouter.get("/status",isAuth,async (req,res)=>{

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const serverStatus = await afip.ElectronicBilling.getServerStatus();
      console.log('Este es el estado del servidor:');
      res.status(200).send(serverStatus); 
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }
    return null     
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  }); 
})

afipRouter.get("/voucherInfo",isAuth,async (req, res) => {     

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(1,1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
      try{
          if(voucherInfo === null){
              console.log('El comprobante no existe');
              res.status(400).send('El comprobante no existe');
          }
          else{
              console.log('Esta es la información del comprobante:');
              console.log(voucherInfo);
              res.status(200).send({voucher:voucherInfo});
          }
      }catch(err){
          res.status(404).send(err);
      }  	
      return null     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });   
});

afipRouter.get("/getLastVoucherInfo",isAuth,async (req, res) => {     

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const numero = await afip.ElectronicBilling.getLastVoucher(1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
      const voucherInfo = await afip.ElectronicBilling.getVoucherInfo(numero,1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
      try{
          if(voucherInfo === null){
              console.log('El comprobante no existe');
              res.status(400).send('El comprobante no existe');
          }
          else{
              console.log('Esta es la información del comprobante:');
              console.log(voucherInfo);
              res.status(200).send({voucher:voucherInfo});
          }
      }catch(err){
          res.status(404).send(err);
      }  	     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }    
    return null 
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });   
});

afipRouter.get("/getLastVoucherNumber",isAuth,async (req, res) => {     

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data()) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert',ta_folder:'./temp' });
      const voucherInfo = await afip.ElectronicBilling.getLastVoucher(1,6); //Devuelve la información del comprobante 1 para el punto de venta 1 y el tipo de comprobante 6 (Factura B)
      try{
          if(voucherInfo === null){
              console.log('El comprobante no existe');
              res.status(400).send('El comprobante no existe');
          }
          else{
              console.log('Esta es la información del comprobante:');
              console.log(voucherInfo);
              res.status(200).send({voucher:voucherInfo});
          }
      }catch(err){
          res.status(404).send(err);
      }  	     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  },err=>{
    console.log(err)
    res.status(500).send(err);
    return null
  }).catch(err=>{
    console.log(err)
    return  res.status(500).send(err);
  });   
});

afipRouter.post("/createVoucher",isAuth,async (req, res) => { 
  
  if(!req.body.puntoVenta){
    res.status(400).send("Campo punto de venta obligatorio");
    return null
  }
  let ptoVta = req.body.puntoVenta;
  let cbtTipo = req.body.cbtTipo;
  let concepto = req.body.concepto;
  let docTipo =req.body.docTipo;
  let docNro = req.body.docNro;
  let cbteFecha = parseInt(req.body.cbteFecha.replace(/-/g, ''));
  let impTotal =req.body.impTotal;
  let impTotConc =req.body.impTotConc;
  let impNeto = req.body.impNeto;
  let impOpEx = req.body.impOpEx;
  let ImpIVA =req.body.ImpIVA;
  let impTrib = req.body.impTrib;
  let monId = req.body.monId;
  let monCotiz =req.body.monCotiz;

  console.log(cbteFecha)

  let iva = [] //opcional
  if(req.body.iva){    
    req.body.iva.forEach(element => {
      console.log(element)
      let item = { 
        Id: element.ivaId,
        BaseImp: element.BaseImp,
        Importe: element.Importe
      }
      iva.push(item);
    });
  }
  console.log(iva)


  let tributos = [] //opcional
  if(req.body.tributos){   
    req.body.tributos.forEach(element => {
      let item = { 
        Id: element.ivaId,
        BaseImp: element.BaseImp,
        Importe: element.Importe
      }
      tributos.push(item);
    });
  }

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert:req.user.comercioId+".pem", key:req.user.comercioId+".key", res_folder: 'afip/cert' ,ta_folder:'./temp' });
      const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      //Aca debo obtener el último número de voucher getLastVoucher
      const lastVoucherNumber = await afip.ElectronicBilling.getLastVoucher(1,6); //Devuelve la información del ultimo voucher
      let data = {
          'CantReg' 	: 1,  // Cantidad de comprobantes a registrar
          'PtoVta' 	: ptoVta, // 1,  // Punto de venta
          'CbteTipo' 	: cbtTipo, //6,  // Tipo de comprobante (ver tipos disponibles) 
          'Concepto' 	: concepto, //1,  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
          'DocTipo' 	: docTipo, //99, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
          'DocNro' 	: docNro, //0,  // Número de documento del comprador (0 consumidor final)
          'CbteDesde' 	: lastVoucherNumber +1,  // Número de comprobante o numero del primer comprobante en caso de ser mas de uno
          'CbteHasta' 	: lastVoucherNumber +1,  // Número de comprobante o numero del último comprobante en caso de ser mas de uno
          'CbteFch' 	: cbteFecha, //parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
          'ImpTotal' 	: impTotal, //121, // Importe total del comprobante
          'ImpTotConc' 	: impTotConc, //0,   // Importe neto no gravado
          'ImpNeto' 	: impNeto, //100, // Importe neto gravado
          'ImpOpEx' 	: impOpEx, //0,   // Importe exento de IVA
          'ImpIVA' 	: ImpIVA, //21,  //Importe total de IVA
          'ImpTrib' 	: impTrib, //0,   //Importe total de tributos
          'MonId' 	: monId,//'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
          'MonCotiz' 	: monCotiz, //1,     // Cotización de la moneda usada (1 para pesos argentinos)  
      };

     

      if(tributos.length > 0){
        data.Tributos = tributos
      }

      if(iva.length > 0){
        data.Iva = tributos
      }

      const respuesta = await afip.ElectronicBilling.createVoucher(data);

      res.status(200).send({CAE:respuesta['CAE'],CAEFchVto:respuesta['CAEFchVto']}); 	     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  }).catch(err=>{
    console.log("!!!"+err)
    return  res.status(400).send({err:""+err});
  });
  
   //CAE asignado el comprobante
   //Fecha de vencimiento del CAE (yyyy-mm-dd)
});

afipRouter.get("/salesPoint",isAuth,async (req, res) => { 

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const salesPoints= await afip.ElectronicBilling.getSalesPoints();
      res.status(200).send({salesPoints:salesPoints});	     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });
 
});

afipRouter.get("/voucherTypes",isAuth,async (req, res) => { 

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs', ta_folder:'./temp' });
      const voucherTypes = await afip.ElectronicBilling.getVoucherTypes();
      res.status(200).send({voucherTypes:voucherTypes});	     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });

  
 
});

afipRouter.get("/conceptTypes",isAuth,async (req, res) => { 

  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const conceptTypes = await afip.ElectronicBilling.getConceptTypes();
      res.status(200).send({conceptTypes:conceptTypes});   
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });
  
 
});

afipRouter.get("/documentTypes",isAuth,async (req, res) => { 
  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const documentTypes  = await afip.ElectronicBilling.getDocumentTypes();
      res.status(200).send({documentTypes:documentTypes }); 	     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });
     
});

afipRouter.get("/aloquotTypes",isAuth,async (req, res) => { 
  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const aloquotTypes  = await afip.ElectronicBilling.getAliquotTypes();
      res.status(200).send({aloquotTypes :aloquotTypes  });   	     
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });
  
});

afipRouter.get("/currenciesTypes",isAuth,async (req, res) => { 
  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const currenciesTypes = await afip.ElectronicBilling.getCurrenciesTypes();
      res.status(200).send({currenciesTypes :currenciesTypes  });        
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }    
    return null 
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });
  
});

afipRouter.get("/optionTypes",isAuth,async (req, res) => { 
  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{

    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const optionTypes  = await afip.ElectronicBilling.getOptionsTypes();
      res.status(200).send({optionTypes  :optionTypes   });   
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }   
    return null  
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });
     
});

afipRouter.get("/taxTypes",isAuth,async (req, res) => { 
  db.collection('afip').doc(req.user.comercioId).get().then(async doc=>{
    if(doc.exists){
      console.log(doc.data().cuit) 
      const afip = new Afip({ CUIT: req.user.cuit, cert: req.user.comercioId+".pem",key: req.user.comercioId+".key", res_folder: 'afip/cert/certs',ta_folder:'./temp' });
      const taxTypes = await afip.ElectronicBilling.getTaxTypes();
      res.status(200).send({taxTypes :taxTypes});  
    }
    else{
      res.status(400).send("Comercio no existe");
      return null
    }     
    return null
  },err=>{
    res.status(500).send(err);
    return null
  }).catch(err=>{
    return  res.status(500).send(err);
  });
   
});

module.exports = afipRouter