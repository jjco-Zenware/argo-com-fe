import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-c-auth',
  templateUrl: './c-auth.component.html',
  styleUrls: ['./c-auth.component.scss']
})
export class CAuthComponent implements OnInit {
  visibleNombre:boolean = true;
  nombreUsuario:string = '';

  ngOnInit(): void { }

  getPasoPass(dato:any){
    this.visibleNombre = false;
  }

  getUsuario(usuario:string){
    this.nombreUsuario = usuario
  }
}
