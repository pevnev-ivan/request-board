import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { boards, card, ListCards, ListsModel } from '../../models/data.model';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  @Input() lists: ListsModel[] = [];
  @Input() listCards: ListCards = {};
  @Input() boardInfo: boards | null = null;
  @Input() boardId: string | null = null;
  @Input() user!: User;

  @Input() editTitle: any;
  @Input() editCard: any;
  @Input() titleChanged: any;
  @Input() addUserEmail: any;

  @Input() addList!: Function;
  @Output() deleteBoardList: EventEmitter<string> = new EventEmitter<string>();

  addCardToggle = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    console.log(this.listCards);
  }

  onDeleteBoardList(list: any) {
    this.deleteBoardList.emit(list);
  }

  getCardsSum(list: any) {
    return list.reduce((sum: number, card: card) => sum + card.price, 0);
  }

  // CARDS logic
  async addCard(list: any) {
    await this.dataService.addListCard(
      list.id,
      this.boardId!,
      this.listCards[list.id].length
    );
  }

  async addCardFast(list: any, email: string) {
    await this.dataService.addListCardFast(
      list.id,
      this.boardId!,
      this.listCards[list.id].length,
      email
    );
  }

  editingCard(card: card, edit = false) {
    this.editCard[card.id] = edit;
  }

  async updateCard(card: card) {
    await this.dataService.updateCard(card);
    this.editingCard(card, false);
  }

  async deleteCard(card: card) {
    await this.dataService.deleteCard(card);
  }

  async swapCard(card: card) {
    await this.dataService.swapCard(card);
  }

  async drop(event: CdkDragDrop<any>) {
    let listId = event.previousContainer.data[0].list_id;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      let newListId = event.container.data[0].list_id;
      if (event.container.data.length === 1) {
        // this.swapCard(this.listCards[newListId][event.previousIndex]);
      }
      this.listCards[newListId] = this.listCards[newListId].map(
        (card: card, index: number) => {
          return { ...card, position: index, list_id: newListId };
        }
      );
      this.listCards[newListId].map((card: any, index: number) => {
        this.updateCard(card);
      });
    }

    this.listCards[listId] = this.listCards[listId].map(
      (card: any, index: number) => {
        return { ...card, position: index, list_id: listId };
      }
    );

    this.listCards[listId].map((card: any, index: number) => {
      this.updateCard(card);
    });
  }

  getConnectedStatuses(listId: number) {
    return this.listCards[listId]
      .filter((list: any) => list.id !== listId)
      .map((list: any) => `index-${list.id}`);
  }
}
