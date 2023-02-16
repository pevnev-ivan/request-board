import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../enviroments/enviroment';
import {
  boards,
  BoardsModel,
  ListCards,
  ListsModel,
} from '../../shared/models/data.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnChanges {
  user$: Observable<User> = this.auth.currentUser;
  boards: BoardsModel[] = [];
  lists: ListsModel[] = [];
  listCards: ListCards = {};
  boardInfo: boards | null = null;

  boardId: string | null = null;
  editTitle: any = {};
  editCard: any = {};

  titleChanged = false;
  dataDownloaded = false;
  addUserEmail = '';

  private supabase: SupabaseClient;
  constructor(
    private auth: AuthService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    this.user$ = this.auth.currentUser;
  }

  async ngOnInit() {
    this.boards = await this.dataService.getBoards();
    this.boardId = this.route.snapshot.paramMap.get('id');

    if (this.boardId) {
      const board = await this.dataService.getBoardInfo(this.boardId);
      this.boardInfo = board.data;
      this.lists = await this.dataService.getBoardLists(this.boardId);
      for (let list of this.lists) {
        this.listCards[list.id] = await this.dataService.getListCards(list.id);
      }
      this.dataDownloaded = true;
    }
    if (this.boards.length === 0) {
      this.startBoard();
    }
    this.handleRealtimeUpdates();
    this.dataDownloaded = true;
  }

  async changeBoard(boardId: string) {
    this.boardId = boardId;
    const board = await this.dataService.getBoardInfo(boardId);
    this.boardInfo = board.data;
    this.lists = await this.dataService.getBoardLists(boardId);
    for (let list of this.lists) {
      this.listCards[list.id] = await this.dataService.getListCards(list.id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes in main');
  }

  async startBoard() {
    console.log('add');
    console.log(this.boards);
    await this.dataService.startBoard();
    console.log(this.boards);
    let boardsLength = this.boards.length - 1;

    if (boardsLength > 0) {
      const newBoard = this.boards[boardsLength];
      // this.router.navigateByUrl(`/groups/${newBoard.boards.id}`)
    }
  }

  signOut() {
    this.auth.logout();
  }

  // BOARD logic
  async saveBoardTitle() {
    await this.dataService.updateBoard(this.boardInfo);
    this.titleChanged = false;
  }

  async deleteBoard(boardId: number) {
    await this.dataService.deleteBoard(boardId);
  }

  // LISTS logic
  async addList() {
    await this.dataService.addBoardList(this.boardId!, this.lists.length);
  }

  editingTitle(list: any, edit = false) {
    this.editTitle[list.id] = edit;
  }

  async updateListTitle(list: any) {
    await this.dataService.updateBoardList(list);
    this.editingTitle(list, false);
  }

  async deleteBoardList(list: any) {
    await this.dataService.deleteBoardList(list);
  }

  // Invites
  async addUser() {
    await this.dataService.addUserToBoard(this.boardId!, this.addUserEmail);
    this.addUserEmail = '';
  }

  dataCheck() {
    return this.lists.length && Object.keys(this.listCards).length;
  }

  handleRealtimeUpdates() {
    this.dataService.getTableChanges().subscribe((update: any) => {
      console.log('Update Frontend After Changes in BD!');
      const record = update.new?.id ? update.new : update.old;
      const event = update.eventType;

      if (!record) return;

      if (update.table == 'cards') {
        if (event === 'INSERT') {
          this.listCards[record.list_id].push(record);
        } else if (event === 'UPDATE') {
          const newArr = [];
          for (let card of this.listCards[record.list_id]) {
            if (card.id == record.id) {
              card = record;
            }
            newArr.push(card);
          }
          this.listCards[record.list_id] = newArr;
        } else if (event === 'DELETE') {
          this.listCards[record.list_id] = this.listCards[
            record.list_id
          ].filter((card: any) => card.id !== record.id);
        }
      } else if (update.table == 'lists') {
        if (event === 'INSERT') {
          this.lists.push(record);
          this.listCards[record.id] = [];
        } else if (event === 'UPDATE') {
          this.lists.filter((list: any) => list.id === record.id)[0] = record;

          const newArr = [];

          for (let list of this.lists) {
            if (list.id == record.id) {
              list = record;
            }
            newArr.push(list);
          }
          this.lists = newArr;
        } else if (event === 'DELETE') {
          this.lists = this.lists.filter((list: any) => list.id !== record.id);
        }
      } else if (update.table == 'boards') {
        if (event === 'INSERT') {
          console.log(record);
          console.log(this.boards);
          let key = this.boards[this.boards.length - 1];
          let newBoard = {
            key: record,
          };
          // this.boards.push(newBoard)
        }
      }
    });
  }
}
