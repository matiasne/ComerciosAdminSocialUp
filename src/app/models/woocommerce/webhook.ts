export class WebHook{    
    public id:number
    public name:string
    public status:string
    public topic:string
    public resource:string
    public event:string
    public delivery_url:string
    public date_created:string
    public hooks = []
}