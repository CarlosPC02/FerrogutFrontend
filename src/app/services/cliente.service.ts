import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlApi: string = environment.endpoint + "cliente/";


  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}index`)
  }

  guardar(request: Cliente):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}create`, request)
  }

  editar(id: number, request: Cliente):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}update/${id}`, request)
  }

  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}delete/${id}`)
  }
}
