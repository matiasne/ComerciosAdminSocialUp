
export enum EnumPlanes {
    free = 1, 
    spark = 2, 
    premium = 3
}


export class User{
    public uid="";
    public state ="";
    public photoUrl ="";
    public notificacionesCelularToken="";
    public last_changed="";
    public email ="";
    public displayName=""; 
    public createdAt="";
    public plan = EnumPlanes.free

    

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<User>) {
        Object.assign(this, init);
    }
}