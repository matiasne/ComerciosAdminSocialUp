import { catchError } from "rxjs/operators"
import { throwError, Observable } from "rxjs"
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Router } from "@angular/router"

import { ToastService } from "../toast.service"

@Injectable({
    providedIn: "root"
})

export class WoocommerceInterceptorService implements HttpInterceptor {

    constructor(
    private toastService:ToastService,
    ) {}

    intercept(req:HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err)=>this.handleError(err))
        )
    }

    public handleError(error:HttpErrorResponse):Observable<HttpEvent<any>> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", JSON.parse(error.error.message))
            alert(error.error.message)
        }
   
        if (error.status === 0) {      
            this.toastService.mensaje("¡Ups!", "No hay conexión a internet.")
        }      

        if (error.status === 422) {
            let mensaje = ""
            Object.keys(error.error.errors).forEach(key=> {
                mensaje += error.error.errors[key][0] + "\n"        
            })
            this.toastService.mensaje(error.error.message, mensaje)
        } 

        if (error.status > 499) {
            this.toastService.mensaje(error.error.message, "Ocurrió un error inesperado en el servidor. Por favor intentá de nuevo más tarde.")
        } 
   
        return throwError(error)
    }
}
