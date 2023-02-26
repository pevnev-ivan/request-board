import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { ListCards, ListsModel, users } from '../../models/data.model';
import { User } from '@supabase/supabase-js';
import { Priorities } from '../../constants/constants';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss'],
})
export class SearchboxComponent {
  constructor(private readonly dialog: MatDialog) {}

  @Input() lists: ListsModel[] = [];
  @Input() boardId: string;
  @Input() listCards: ListCards = {};
  @Input() user: User | null;
  @Input() users: users[];
  @Input() searchQuery: string;
  @Input() searchValue: string;
  @Input() priorityId: number;
  @Output() changeSearchQuery: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() changeFilterPriority: EventEmitter<number> =
    new EventEmitter<number>();
  allPriorities = Priorities;

  public openDialog() {
    this.dialog.open(AddTaskComponent, {
      data: {
        lists: this.lists,
        boardId: this.boardId,
        listCards: this.listCards,
        user: this.user,
        users: this.users,
      },
    });
  }

  onPriorityFilterChange(priorityId: number) {
    this.priorityId = priorityId;
    this.changeFilterPriority.emit(this.priorityId);
  }
  onSearchBoxChange() {
    this.changeSearchQuery.emit(this.searchValue);
  }

  onClearSearchBox() {
    this.searchValue = '';
    this.onSearchBoxChange();
  }
}
