import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';

import { Venta } from '../interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi: string = environment.endpoint + "venta/";

  constructor(private http:HttpClient) { }

  guardar(request: any[]):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}create`, request)
  }

  historial(buscarPor:string, idVenta:number, fechaInicio:string, fechaFin:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}historial?buscarPor=${buscarPor}&numeroVenta=${idVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }

  reporte(fechaInicio:string, fechaFin:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }



}
