import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Priorities } from '../../constants/constants';
import { DataService } from '../../../services/data.service';
import { User } from '@supabase/supabase-js';
import { ListCards, ListsModel } from '../../models/data.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  lists: ListsModel[] = this.data.lists;
  boardId = this.data.boardId;
  listCards: ListCards = this.data.listCards;
  user: User = this.data.user;
  users = this.data.users;

  listNames = this.lists;
  userEmailList: string[] = [];
  allPriorities = Priorities;

  newCard = {
    title: '',
    list_id: this.lists[0].id,
    board_id: 0,
    price: 0,
    priority: 0,
  };

  newCardTitle: string;
  newCardPrice: number;
  newCardEmail: string;
  newListTitle: string;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.user.email && this.userEmailList.push(this.user.email);
    for (let user of this.users) {
      user.email && this.userEmailList.push(user.email);
    }
    this.newCardEmail = this.userEmailList[0];
    this.newListTitle = this.lists[0].title;
    debugger;
  }

  setListForCard(listId: string, listTitle: string): void {
    this.newCard.list_id = listId;
    this.newListTitle = listTitle;
    this.listNames = this.lists.filter(
      (list: ListsModel) => this.newCard.list_id == list.id
    );
  }

  filterPriorities() {
    return this.allPriorities.filter(
      (priority) => priority.id !== this.newCard.priority
    );
  }

  setPriority(priorityId: number) {
    this.newCard.priority = priorityId;
    this.filterPriorities();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async addCard() {
    let title = this.newCardTitle;
    let listId = this.newCard.list_id.toString();
    let boardId = this.boardId;
    let price = this.newCardPrice;
    let priority = this.newCard.priority;
    let position = this.listCards[this.newCard.list_id].length;
    let owner_email = this.newCardEmail;

    if (title && price) {
      await this.dataService.addListCard(
        title,
        listId,
        boardId,
        price,
        priority,
        position,
        owner_email
      );
      this.closeDialog();
    } else {
      alert('Enter title and price');
    }
  }
}
