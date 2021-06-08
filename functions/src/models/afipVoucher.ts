export class IvaItem {
    public Id ="";
    public BaseImp="";
    public Importe="";   
    
    public asignarValores(init?: Partial<IvaItem>) {
        Object.assign(this, init);
    }
}

export class CbtesAsoc{
    public Tipo ="";
    public PtoVta ="";
    public Nro="";
    public Cuit="";

    public asignarValores(init?: Partial<CbtesAsoc>) {
        Object.assign(this, init);
    }
}

export class TributoItem{
    public Id ="";
    public Desc="";
    public BaseImp="";
    public Alic="";
    public Importe ="";

    public asignarValores(init?: Partial<TributoItem>) {
        Object.assign(this, init);
    }
}

export class Opcionales{
    public Id="";
    public Valor="";

    public asignarValores(init?: Partial<Opcionales>) {
        Object.assign(this, init);
    }
}

export class Compradores{
    public DocTipo ="";
    public DocNro="";
    public Porcentaje="";

    public asignarValores(init?: Partial<Compradores>) {
        Object.assign(this, init);
    }
}

export class AfipVoucher{
    public CantReg:number =0;
    public PtoVta:any
    public CbteTipo="";
    public Concepto = "";
    public DocTipo=""; //esto se agrega cuando es un adquirido
    public DocNro=""; //esto se agrega cuando es un adquirido
    public CbteDesde=""; //esto se agrega cuando es un adquirido
    public CbteHasta=""; //esto se agrega cuando es un adquirido
    public CbteFch=0; //esto se agrega cuando es un adquirido
    public ImpTotal=""; //esto se agrega cuando es un adquirido
    public ImpTotConc=""; //esto se agrega cuando es un adquirido
    public ImpNeto=""; //esto se agrega cuando es un adquirido
    public ImpOpEx=""; //esto se agrega cuando es un adquirido
    public ImpIVA=""; //esto se agrega cuando es un adquirido
    public ImpTrib=""; //esto se agrega cuando es un adquirido
    public MonId=""; //esto se agrega cuando es un adquirido
    public MonCotiz=""; //esto se agrega cuando es un adquirido

    public CbtesAsoc=[];
    public Iva:IvaItem[]=[]; //esto se agrega cuando es un adquirido
    public Tributos:TributoItem[] = [];
    public Opcionales=[]; //esto se agrega cuando es un adquirido
    public Compradores = [];

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<AfipVoucher>) {
        Object.assign(this, init);
    }
}