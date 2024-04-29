
import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Proveedor } from '../interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private urlApi: string = environment.endpoint + "proveedor/";


  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}index`)
  }

  guardar(request: Proveedor):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}create`, request)
  }

  editar(id: number, request: Proveedor):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}update/${id}`, request)
  }

  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}delete/${id}`)
  }

}
