export class variacionStock{
    public productoId ="";
    public stock = 0;

	constructor(
		
		){
    }
    
    public asignarValores(init?: Partial<variacionStock>) {
        Object.assign(this, init);
    }
}