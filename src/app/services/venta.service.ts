import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';

import { Envio } from '../interfaces/envio';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi: string = environment.endpoint + "venta/";

  constructor(private http:HttpClient) { }

  guardar(request: any[]):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}create`, request)
  }

  historial(request: Envio):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}historial`, request)
  }

  listaDetalleVenta(id: number){
    return this.http.get<ResponseApi>(`${environment.endpoint}detalleVenta/index/${id}`);
  }

  listarRecolecciones(id: number){
    return this.http.get<ResponseApi>(`${environment.endpoint}/recoleccion/index/${id}`);
  }

}
