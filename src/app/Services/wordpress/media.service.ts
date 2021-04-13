import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WordpressService } from './wordpress.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class WPMediaService extends WordpressService {

  constructor(
    public http:HttpClient,
    public transfer:FileTransfer
    ) { 
    super(http)
    this.setPart("media")
  }

  uploadBinary(data){  
    let httpHeaders = new HttpHeaders({ 
        Accept: 'application/json',
        'Content-Disposition': 'attachment; filename=logo.png',
        'Content-Type':'multipart/form-data;',
        Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sYXBhcnJpbGxhZGVnZXJhcmRvLmNvbS5hciIsImlhdCI6MTYxNzAzOTQ1NywibmJmIjoxNjE3MDM5NDU3LCJleHAiOjE2MTc2NDQyNTcsImRhdGEiOnsidXNlciI6eyJpZCI6IjMifX19.FRLKsRUb6f-15LVeGsRjQVGSFnfjRgIqlG-iN60I638"
      });       
      let options = {   
        headers: httpHeaders  
      };     

      const formData = new FormData(); 

      formData.append('file',data)
     
      let body = { 
        file:data
      }

      console.log(body)
  
      console.log(this.apiUrl)
      return this.http.post(this.apiUrl,formData,options).subscribe(data=>{
        console.log(data)
      },err=>{
        console.log(err)  
      }); 

  }

upload(data){ 

    console.log("subiendo wordpress")
    const formData = new FormData(); 
    formData.append('file', data); 
    formData.append("title", "Hello World!");
    formData.append("caption", "Have a wonderful day!");

    let httpHeaders = new HttpHeaders({ 
    //  'Content-Type':'multipart/form-data'
      Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sYXBhcnJpbGxhZGVnZXJhcmRvLmNvbS5hciIsImlhdCI6MTYxNzAzOTQ1NywibmJmIjoxNjE3MDM5NDU3LCJleHAiOjE2MTc2NDQyNTcsImRhdGEiOnsidXNlciI6eyJpZCI6IjMifX19.FRLKsRUb6f-15LVeGsRjQVGSFnfjRgIqlG-iN60I638"
    });       
    let options = {   
      headers: httpHeaders
    };     

    console.log(data)
    return this.http.post(this.apiUrl,formData,options).subscribe(data=>{
      console.log(data)
    },err=>{
      console.log(err) 
    }); 
    
  }
  


}
