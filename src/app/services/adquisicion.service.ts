import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';

import { Adquisicion } from '../interfaces/adquisicion';
import { Envio } from '../interfaces/envio';

@Injectable({
  providedIn: 'root'
})
export class AdquisicionService {

  private urlApi: string = environment.endpoint + "adquisicion/";

  constructor(private http:HttpClient) { }

  guardar(request: any[]):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}create`, request);
  }

  historial(request: Envio):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}historial`, request);
  }

  listaDetalleAdquisicion(id: number){
    return this.http.get<ResponseApi>(`${environment.endpoint}detalleAdquisicion/index/${id}`);
  }



}
