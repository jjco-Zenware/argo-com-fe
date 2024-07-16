import { Component, OnInit } from '@angular/core';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
    selector: 'app-c-dashboard',
    templateUrl: './c-dashboard.component.html',
    styleUrls: ['./c-dashboard.component.scss'],
})

export class CDashboardComponent implements OnInit {
    //tareasDias:any;
    nomUsuario: string;
    nomPerfil: string;

    $listSubcription: Subscription[] = [];
    events: any;
    Cliente: any;
    Proveedor: any;
    event: any;
    dataCT: any;
    //dataCTlst:any;
    idperfil: number = 0;
    verDashboard: boolean = true;
    visQuote: boolean = false;
    visBussines: boolean = false;
    codigoBC:string="";
    annio!: Date;
    lstQ: any[]=[];


    constructor(private route: ActivatedRoute,
        private messageService: MessageService,
        private utilitariosService: UtilitariosService
        ) {

        console.log('constantesLocalStorage', constantesLocalStorage);

        this.nomUsuario = constantesLocalStorage.nombreUsuario;
        this.nomPerfil = '@' + constantesLocalStorage.nomperfil;
        this.idperfil = constantesLocalStorage.idperfil;
    }


    ngOnInit(): void {
       
      }

      

      ngOnDestroy() {
        if (this.$listSubcription != undefined) {
          this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
      }

      

    

}
