import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { CChatComponent } from './c-chat/c-chat.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { UserCardComponent } from './user-card/user-card.component';
import { ChatService } from './service/chat.service';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RippleModule } from 'primeng/ripple';
import { FormatoTextoPipe } from '../@pipes/FormatoTextoPipe';
import { SharedAppModule } from 'src/app/shared/shared-App.module';


@NgModule({
  declarations: [
    CChatComponent,
    ChatBoxComponent,
    ChatSidebarComponent,
    UserCardComponent,
    FormatoTextoPipe
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    AvatarModule,
    InputTextModule,
    ButtonModule,
    BadgeModule,
    OverlayPanelModule,
    RippleModule,
    SharedAppModule
  ],
  providers: [
    ChatService
  ]
})
export class ChatModule { }
