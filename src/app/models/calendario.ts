export class Calendario{

    public id ="";
    public nombre="";   

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Calendario>) {
        Object.assign(this, init);
    }
}