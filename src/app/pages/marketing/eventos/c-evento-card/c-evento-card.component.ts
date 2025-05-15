import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
//import { KanbanCard } from 'src/app/demo/api/kanban';
import { Subscription } from 'rxjs';
import { eventoCard } from '@interfaces';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { MarketingService } from '../../service/marketingServices';
import { Menu } from 'primeng/menu';

@Component({
    selector: 'c-evento-card',
    templateUrl: './c-evento-card.component.html',
})
export class CEventoCardComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];

    @Input() card!: any;
    @Input() listId!: string;
    menuItems: MenuItem[] = [];
    blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  @ViewChild('menu') menu!: Menu;

    //subscription!: Subscription;
    //@Output() actualizarKanbanList = new EventEmitter<string>();

    constructor(private marketingService: MarketingService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService) {
        // this.subscription = this.marketingService.lists$.subscribe((data) => {
        //     let subMenu = data.map((d) => ({
        //         id: d.listId,
        //         label: d.title,
        //         //command: () => this.onMove(d.listId),
        //     }));
        //     this.generateMenu(subMenu);
        // });
    }

    ngOnInit() {}

    setSpinner(valor: boolean) {
        this.blockedDocument = valor;
      }

    ngOnDestroy() {
        if (this.$listSubcription != undefined) {
            this.$listSubcription.forEach((sub) => sub.unsubscribe());
          }
    }

    parseDate(dueDate: string) {
        let mes = dueDate.substring(3,5);
        let dia = dueDate.substring(0,2);
        let anio = dueDate.substring(6,10);

        let fecha = mes+'/'+dia+'/'+anio;
        return new Date(fecha)
            .toDateString()
            .split(' ')
            .slice(1, 3)
            .join(' ');
    }

    parseDia(dueDate: string) {
        return dueDate.substring(0,2)
    }

    eliminarCard() {
        this.confirmationService.confirm({
            key: 'confirm1',
            header: 'Confirmación',
            //target: event.target || new EventTarget,
            message: '¿Estás seguro de Eliminar la Oportunidad '+ '<b>'+this.card.title +'</b>'+ '?',
            //icon: 'pi pi-exclamation-triangle text-6xl',
            accept: () => {
                this.onDelete();
            }
        });
    }

    onDelete() {

        // const $updateCard = this.kanbanService.deleteCard(this.card.id, this.listId)
        //     .subscribe({
        //         next: (rpta:any) => {
        //            console.log("rpta delete------Card : ", rpta.resultProceso);
        //            if (rpta.resultProceso == "0"){
        //             console.log("resultProceso------Card : ", rpta.resultProceso);
        //             this.kanbanService.deleteCardLista(this.card.id, this.listId);
        //            }
        //         },
        //         error:(err)=>{
        //             console.error('error : ',err)
        //             this.messageService.clear();
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: 'Error',
        //                 detail: mensajesQuestion.msgErrorGenerico
        //             })
        //         },
        //         complete:() => {
        //             console.log("rpta delete-----Card complete ");
        //          }
        //     });
    }

    onCopy() {
        //this.kanbanService.copyCard(this.card, this.listId);
    }

    onMove(listId: string) {
        //this.kanbanService.moveCard(this.card, listId, this.listId);
    }

    
    generateTaskInfo() {
        let total =this.card.taskList.tasks.length;
        //let completed = 3;
        let completed = this.card.taskList.tasks.filter(
            (t: any) => t.completed
        ).length;
        return `${completed} / ${total}`;
    }

    verDocumento(data: any) {
        console.log('onVerDetalle...', data);
            
        //     this.setSpinner(true);
        //   this.mensajeSpinner = 'Descargando Detalle...!';
      
        //   const objeto = {
        //     idusuario : constantesLocalStorage.idusuario,
        //     iddocumentoprc: data.idordencompra,
        //     codtipoprc: 7,
        //     idplantilla: 0
        //   }
      
        //   const $cargarOrdenC = this.marketingService.pdfDocumentoEvento(objeto).subscribe({
        //     next: (rpta: any) => {
        //       this.setSpinner(false);      
              
        //       const mediaType = 'application/pdf';
        //         const blob = new Blob([rpta.body], { type: mediaType });
        //         const filename = 'DET_FACT_COMPRA_' + data.nrofactura;
        
        //         const url = window.URL.createObjectURL(blob);
        //         const a = document.createElement('a');
        //         a.href = url;
        //         a.download = filename;
        //         document.body.appendChild(a);
        //         a.target = '_blank';
        //         a.click();
      
        //         window.open(url);
      
        //         setTimeout(() => {
        //             document.body.removeChild(a);
        //             window.URL.revokeObjectURL(url);
        //         }, 100);
        //     },
        //         error: (err) => {
        //           this.setSpinner(false);
        //         this.messageService.clear();
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: mensajesQuestion.msgErrorGenerico,
        //         });
        //     },
        //         complete: () => {
        //     },
        //   });
        //   this.$listSubcription.push($cargarOrdenC)
    }
    
  toggleMenu(event: Event, data: any) {
        this.menuItems.push({
            label: 'Ver PDF',
            icon: 'pi pi-file-pdf',
            command: () => this.verDocumento(data)
        })
        this.menu.toggle(event);
      
    }
  
      
}
