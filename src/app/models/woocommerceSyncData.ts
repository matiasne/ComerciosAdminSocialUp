export class WoocommerceSyncData{
    public id ="";
    public lastUpdate:any;
    public sincronizado = true;
    public changeDate:any
    constructor(
        
        ){
    }

    public asignarValores(init?: Partial<WoocommerceSyncData>) {
        Object.assign(this, init);
    }
}