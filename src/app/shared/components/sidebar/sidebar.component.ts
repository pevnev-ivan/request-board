import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BoardsModel} from "../../models/data.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() boards: BoardsModel[] = [];
  @Input() boardId!: string | null
  @Output() startBoard: EventEmitter<void> = new EventEmitter<void>()
  @Output() changeBoard: EventEmitter<string> = new EventEmitter<string>()
  @Output() deleteBoard: EventEmitter<number> = new EventEmitter<number>()

  constructor() {}

  onStartBoard() {
    this.startBoard.emit()
  }

  async onChangeBoard(boardId: number) {
    this.boardId = boardId.toString()
    this.changeBoard.emit(this.boardId)
  }

  onDeleteBoard(boardId: number) {
    this.deleteBoard.emit(boardId)
  }
}
