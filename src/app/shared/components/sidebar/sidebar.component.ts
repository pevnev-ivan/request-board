import { Component, EventEmitter, Input, Output } from '@angular/core';
import { boards, BoardsModel, editTitles } from '../../models/data.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() boards: BoardsModel[] = [];
  @Input() boardId: string | null;
  @Input() editBoardTitle: editTitles;
  @Input() headerToggle: boolean;
  @Output() startBoard: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteBoard: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateBoardTitle: EventEmitter<boards> = new EventEmitter<boards>();

  constructor() {}

  onStartBoard() {
    this.startBoard.emit();
  }

  onDeleteBoard(boardId: number) {
    this.deleteBoard.emit(boardId);
  }

  onInputChange(board: boards) {
    this.editBoardTitle[board.id] = true;
  }

  onUpdateBoardTitle(board: boards) {
    this.editBoardTitle[board.id] = false;
    this.updateBoardTitle.emit(board);
  }
}
