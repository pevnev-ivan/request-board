import { Component, Inject, OnInit } from '@angular/core';
import { card, ListCards, ListsModel, users } from '../../models/data.model';
import { DataService } from '../../../services/data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@supabase/supabase-js';
import { Priorities } from '../../constants/constants';
import { transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  list: ListsModel;
  lists: ListsModel[] = this.data.lists;
  listCards: ListCards = this.data.listCards;
  card: card = this.data.card;
  user: User = this.data.user;
  users: users[] = this.data.users;

  allPriorities = Priorities;

  newCard = { ...this.card };
  initialList = this.card.list_id;

  userEmailList: string[] = [];

  newListTitle = this.lists.find((list) => Number(list.id) == this.card.list_id)
    ?.title;
  newCardEmail: string;
  newCardTitle: string;
  newCardPrice: number;
  listNames = this.lists;

  ngOnInit() {
    this.user.email && this.userEmailList.push(this.user.email);
    for (let user of this.users) {
      user.email && this.userEmailList.push(user.email);
    }
    this.newCardEmail = this.userEmailList[0];
  }

  setListForCard(listId: string, listTitle: string): void {
    this.newCard.list_id = Number(listId);
    this.newListTitle = listTitle;
    this.listNames = this.lists.filter(
      (list: ListsModel) => this.newCard.list_id == Number(list.id)
    );
  }

  filterPriorities() {
    return this.allPriorities.filter(
      (priority) => priority.id !== this.newCard.priority
    );
  }

  async updateCard(card: card) {
    await this.dataService.updateCard(card);
  }

  setPriority(priorityId: number) {
    this.newCard.priority = priorityId;
    this.filterPriorities();
  }

  async addCard() {
    this.newCard.edited_at = new Date();

    if (this.initialList !== this.newCard.list_id) {
      this.newCard.position = this.listCards[this.newCard.list_id].length;
      transferArrayItem(
        this.listCards[this.initialList],
        this.listCards[this.newCard.list_id],
        this.card.position,
        this.listCards[this.newCard.list_id].length
      );
    }

    await this.dataService.updateCard(this.newCard);
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
