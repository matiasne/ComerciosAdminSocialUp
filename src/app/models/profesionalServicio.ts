export class ProfesionalServicio{
    public id ="";
    public rolId = "";
    public email="";
    public horarios=[];
    constructor(
        
        ){
    }

    public asignarValores(init?: Partial<ProfesionalServicio>) {
        Object.assign(this, init);
    }
}