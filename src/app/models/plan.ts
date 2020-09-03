export class Plan{
    public id ="";
    public servicioId = "";
    public nombre:"";
    public tipo="";
    public dias="";
    public precio=0;
    constructor(
        
        ){
    }

    public asignarValores(init?: Partial<Plan>) {
        Object.assign(this, init);
    }
}