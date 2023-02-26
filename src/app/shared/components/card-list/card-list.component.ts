import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data.service';
import {
  card,
  editTitles,
  ListCards,
  ListsModel,
  users,
} from '../../models/data.model';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
  @Input() lists: ListsModel[] = [];
  @Input() listCards: ListCards = {};

  @Input() user: User;
  @Input() users: users[];

  @Input() searchQuery: string;
  @Input() priorityId: number;
  @Input() boardId: string;

  @Input() addList!: Function;
  @Output() deleteBoardList: EventEmitter<ListsModel> =
    new EventEmitter<ListsModel>();

  filteredLists: ListsModel[] = [];
  filteredListCards: ListCards = {};

  addCardToggle = false;
  listEditToggle = false;
  editTitle: editTitles = {};

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  editingTitle(list: ListsModel, edit = false) {
    this.editTitle[list.id] = edit;
  }

  async updateListTitle(list: ListsModel) {
    await this.dataService.updateBoardList(list);
    this.editTitle[list.id] = false;
  }

  onDeleteBoardList(list: ListsModel) {
    this.deleteBoardList.emit(list);
  }

  getCardsSum(cards: card[]) {
    return cards.reduce((sum: number, card: card) => sum + card.price, 0);
  }

  async addCardFast(list: ListsModel, email: string, cardListLength: number) {
    await this.dataService.addListCardFast(
      list.id,
      this.boardId,
      this.listCards[list.id].length,
      email,
      cardListLength
    );
  }

  async updateCard(card: card) {
    await this.dataService.updateCard(card);
  }

  async deleteCard(card: card) {
    await this.dataService.deleteCard(card);
  }

  async drop(event: CdkDragDrop<card[]>) {
    let listId = +event.previousContainer.id;
    let newListId = +event.container.id;

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
      this.listCards[newListId] = this.listCards[newListId].map(
        (card: card, index: number) => {
          return { ...card, position: index, list_id: newListId };
        }
      );
      this.listCards[newListId].map((card: card) => {
        this.updateCard(card);
      });
    }
    this.listCards[listId] = this.listCards[listId].map(
      (card: card, index: number) => {
        return { ...card, position: index, list_id: listId };
      }
    );
    this.listCards[listId].map((card: card) => {
      this.updateCard(card);
    });
  }

  getConnectedStatuses(listId: number) {
    return this.listCards[listId]
      .filter((card: card) => card.id !== listId)
      .map((card: card) => `index-${card.id}`);
  }
}
