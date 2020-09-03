import { Servicio } from './servicio';
import { DocumentReference } from 'angularfire2/firestore';

export class Pagare{
    public id="";
    public subscripcionId ="";
    public monto=0;
    public fecha="";
    public estado ="deuda";
    public servicioRef:DocumentReference;

	constructor(
		
		){
            
	}
}