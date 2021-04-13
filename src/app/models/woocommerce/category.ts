import { WCImage } from "./image"

export class WCCategory{    
    id: number
    name: string
    slug: string

    parent:number
    description:string
    display:string
    image:WCImage
    menu_order:number
    count:number

    public _links: {
        self: [{
            href:string
        }],
        collection: [{
            href:string
        }]
    }

}