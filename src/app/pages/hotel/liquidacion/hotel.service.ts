import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  constructor(private http: HttpClient) { }

  listarProduccionHotel(objeto: any) {
    const url = `${constantesApiWeb.listarProduccionHotel}`;
    return this.http.post<any>(url, objeto)
  }

  roomingList(objeto: any) {
    const url = `${constantesApiWeb.RoomingList}`;
    return this.http.post<any>(url, objeto)
  }

  prcDocumentoRoom(objeto:any) {
          const headers = new HttpHeaders({
              'Content-Type': 'application/json; charset=utf-8',
            });
  
            const url = `${constantesApiWeb.prcDocumentoRoom}`;
            return this.http.post(url,objeto, {
              headers: headers,
              observe: 'response',
              responseType: 'blob'
            })
      }


      exportarexcelhotelLiqui(data: any) {
            const url = `${constantesApiWeb.exportarexcelhotelLiqui}`;
            return this.http
                .post<Blob>(url, data, { responseType: 'blob' as 'json' })
                .pipe(
                map((resp: Blob) => resp));
            }
  
}
