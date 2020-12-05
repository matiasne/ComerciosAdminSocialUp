import { DocumentReference } from 'angularfire2/firestore';

export class Rol{
    public id="";
    public estado ="";
    public comercioId ="";
    public comercioRef:DocumentReference;
    public userEmail="";
    public userId =""; 
    public rol="";

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Rol>) {
        Object.assign(this, init);
    }
}