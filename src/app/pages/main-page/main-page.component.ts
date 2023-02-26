import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../enviroments/enviroment';
import {
  boards,
  BoardsModel,
  card,
  editTitles,
  ListCards,
  ListsModel,
  users,
} from '../../shared/models/data.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  user: User | null;
  users: users[];

  boards: BoardsModel[] = [];
  lists: ListsModel[] = [];
  listCards: ListCards = {};

  boardInfo: boards | null = null;
  boardId: string;

  searchQuery: string = '';
  addUserEmail = '';
  titleChanged = false;
  dataDownloaded = false;
  priorityId: number;

  newBoardTitle: string;
  editBoardTitle: editTitles = {};
  headerToggle = true;

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
  }

  async ngOnInit() {
    this.user = await this.dataService.getCurrentUser();
    this.boards = await this.dataService.getBoards();

    this.route.params.subscribe((params) => {
      this.boardId = params['id'];
      this.loadData();
    });
    this.handleRealtimeUpdates();
  }

  toggleSidebar() {
    this.headerToggle = !this.headerToggle;
  }

  async loadData() {
    this.dataDownloaded = false;
    if (this.boardId) {
      this.users = await this.dataService.getUsersFromBoard(this.boardId);
      this.boardInfo = await this.dataService.getBoardInfo(this.boardId);
      this.lists = await this.dataService.getBoardLists(this.boardId);
      for (let list of this.lists) {
        this.listCards[list.id] = await this.dataService.getListCards(list.id);
      }
      this.dataDownloaded = true;
    }
  }

  async startBoard() {
    await this.dataService.startBoard();
  }

  signOut() {
    this.auth.logout();
  }

  changeSearchQuery(newValue: string) {
    this.searchQuery = newValue;
  }

  changeFilterPriority(priorityId: number) {
    this.priorityId = priorityId;
  }

  // BOARD logic

  async updateBoardTitle(board: boards) {
    await this.dataService.updateBoard(board);
  }

  async deleteBoard(boardId: number) {
    await this.dataService.deleteBoard(boardId);
  }

  // LISTS logic
  async addList(length: number) {
    await this.dataService.addBoardList(
      this.boardId!,
      this.lists.length,
      length
    );
  }

  async deleteBoardList(list: ListsModel) {
    await this.dataService.deleteBoardList(list);
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
          this.listCards[record] = newArr;
        } else if (event === 'DELETE') {
          for (let list in this.listCards) {
            if (this.listCards.hasOwnProperty(list)) {
              this.listCards[list] = this.listCards[list].filter(
                (card: card) => card.id !== record.id
              );
            }
          }
        }
      } else if (update.table == 'lists') {
        if (event === 'INSERT') {
          this.lists.push(record);
          this.listCards[record.id] = [];
        } else if (event === 'UPDATE') {
          this.lists.filter((list: ListsModel) => list.id === record.id)[0] =
            record;
          const newArr = [];
          for (let list of this.lists) {
            if (list.id == record.id) {
              list = record;
            }
            newArr.push(list);
          }
          this.lists = newArr;
        } else if (event === 'DELETE') {
          this.lists = this.lists.filter(
            (list: ListsModel) => list.id !== record.id
          );
        }
      } else if (update.table == 'boards') {
        if (event === 'INSERT') {
          let newBoard = {
            boards: record,
          };
          this.boards.push(newBoard);
        }
        if (event === 'DELETE') {
          this.boards = this.boards.filter(
            (board) => board.boards.id !== record.id
          );
        }
      }
    });
  }
}
