import { DocumentReference } from 'angularfire2/firestore';

export class Rol{
    public id="";
    public estado ="";
    public comercioRef:DocumentReference;
    public user_email=""; 
    public rol="";

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Rol>) {
        Object.assign(this, init);
    }
}