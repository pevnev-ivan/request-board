import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { card, ListCards, ListsModel, users } from '../../models/data.model';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskComponent } from '../edit-task/edit-task.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() card: card;
  @Input() user: User;
  @Input() listCards: ListCards;
  @Input() cardListId: number;
  @Input() lists: ListsModel[];
  @Input() list: ListsModel;
  @Input() users: users[];
  @Output() deleteCard: EventEmitter<card> = new EventEmitter<card>();

  constructor(private readonly dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(EditTaskComponent, {
      data: {
        list: this.list,
        lists: this.lists,
        listCards: this.listCards,
        card: this.card,
        users: this.users,
        user: this.user,
      },
    });
  }

  onDeleteCard(card: card) {
    this.deleteCard.emit(card);
  }
}
