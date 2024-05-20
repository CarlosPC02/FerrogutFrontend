import { Injectable } from '@angular/core';

import { HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';

import { Adquisicion } from '../interfaces/adquisicion';

@Injectable({
  providedIn: 'root'
})
export class AdquisicionService {

  private urlApi: string = environment.endpoint + "adquisicion/";

  constructor(private http:HttpClient) { }

  guardar(request: any[]):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}create`, request)
  }

  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}delete/${id}`)
  }


}
