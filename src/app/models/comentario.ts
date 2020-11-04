export class Comentario{
    public id="";
    public text ="";
    public senderId="";
    public senderEmail ="";
    public likes = 0;    
    public createdAt =new Date();;
	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<Comentario>) {
        Object.assign(this, init);
    }
}