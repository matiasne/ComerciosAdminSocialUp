import { WCCategory } from "./category"
import { WCImage } from "./image"

export class WCProduct{   

public id:string
public name:string
public slug:string
public permalink:string
public date_created:string
public date_created_gmt:string
public date_modified:string
public date_modified_gmt:string
public type:string
public status:string
public featured:boolean
public catalog_visibility:string
public description:string
public short_description:string
public sku:string 
public price:string
public regular_price:string
public sale_price:string
public date_on_sale_from:string
public date_on_sale_from_gmt:string
public date_on_sale_to:string
public date_on_sale_to_gmt:string
public price_html:string
public on_sale:boolean
public purchasable:boolean
public total_sales:number
public virtual:boolean
public downloadable:boolean
public downloads:any[]
public download_limit:number
public download_expiry:number
public external_url:string 
public button_text:string
public tax_status:string
public tax_class:string 
public manage_stock:boolean
public stock_quantity:string
public stock_status:string
public backorders:string
public backorders_allowed:boolean
public backordered:boolean
public sold_individually:boolean
public weight:string 
public dimensions: {
    length:string, 
    width:string, 
    height:string 
}
public shipping_required:boolean
public shipping_taxable:boolean
public shipping_class:string 
public shipping_class_id:number
public reviews_allowed:boolean
public average_rating:number
public rating_count:number
public related_ids:number[]
public upsell_ids:number[]
public cross_sell_ids:number[]
public parent_id:number
public purchase_note:string 
public categories:any[]
public tags: []
public images:any[] 
public attributes:any[]
public default_attributes:any[]
public variations:any[]
public grouped_products:any[]
public menu_order:number
public meta_data:any
public quantity=0
public total =0
public _links: {
    self: [{
        href:string
    }],
    collection: [{
        href:string
    }]
}

}