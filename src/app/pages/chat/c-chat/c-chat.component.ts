import { Component, OnDestroy } from '@angular/core';
import { User } from '@interfaces';
import { Subscription } from 'rxjs';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-c-chat',
  templateUrl: './c-chat.component.html',
  styleUrls: ['./c-chat.component.scss']
})
export class CChatComponent  implements OnDestroy {

  subscription: Subscription;

  activeUser!: Partial<User>;
  
  constructor(private chatService: ChatService) { 
      this.subscription = this.chatService.activeUser$.subscribe(data => this.activeUser = data);
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}