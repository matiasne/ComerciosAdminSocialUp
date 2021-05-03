import { WCBilling } from "./billing"
import { WCMetadata } from "./metadata"
import { WCShipping } from "./shipping"


export class WCOrder{  
    public id:number
    public parent_id: 0
    public number: string
    public order_key: string
    public created_via: string
    public version:string
    public status:string
    public currency:string
    public date_created:string
    public date_created_gmt:string
    public date_modified: string
    public date_modified_gmt: string
    public discount_total:string
    public discount_tax:string
    public shipping_total:string
    public shipping_tax:string
    public cart_tax:string
    public total:string
    public total_tax:string
    public prices_include_tax:boolean
    public customer_id:number
    public customer_ip_address:string
    public customer_user_agent:string
    public customer_note:string
    public billing:WCBilling
    public shipping:WCShipping
    public payment_method:string
    public payment_method_title:string
    public transaction_id:string
    public date_paid:string
    public date_paid_gmt:string
    public date_completed:string
    public date_completed_gmt:string
    public cart_hash:string
    public meta_data:any
    public line_items:any[]
    public tax_lines:any[]
    public shipping_lines:any[]
    public fee_lines:any[]
    public coupon_lines:any[]
    public refunds:any[]
    public currency_symbol: string
    public _links: {
        self: [{
            href:string
        }],
        collection: [{
            href:string
        }]
    }


    public statusCobro:any //Algo agregado por socialup

    constructor(){
        this.shipping = new WCShipping()
        this.billing = new WCBilling()
        
    }

    public asignarValores(init?: Partial<WCOrder>) {
        
        Object.assign(this, init);
        
    }

}