import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroment';
import { Subject } from 'rxjs';
import { boards, card, ListsModel } from '../shared/models/data.model';

export const BOARDS_TABLE = 'boards';
export const USER_BOARDS_TABLE = 'user_boards';
export const LISTS_TABLE = 'lists';
export const CARDS_TABLE = 'cards';
export const USERS_TABLE = 'users';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getAllListCards() {
    const lists = await this.supabase
      .from(CARDS_TABLE)
      .select('*')
      .order('position');

    return lists.data || [];
  }

  async getAllLists() {
    const lists = await this.supabase
      .from(LISTS_TABLE)
      .select('*')
      .order('position');

    return lists.data || [];
  }

  async getAllBoards() {
    const boards = await this.supabase.from(USER_BOARDS_TABLE).select('*');
    return boards.data || [];
  }

  async startBoard() {
    return this.supabase.from(BOARDS_TABLE).insert({});
  }

  async getBoards() {
    const boards = await this.supabase
      .from(USER_BOARDS_TABLE)
      .select('boards:board_id(*)');
    return boards.data || [];
  }

  // CRUD Board
  async getBoardInfo(boardId: string) {
    const boardInfo = await this.supabase
      .from(BOARDS_TABLE)
      .select('*')
      .match({ id: boardId })
      .single();
    return boardInfo.data;
  }

  async getCurrentUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }

  async updateBoard(board: boards) {
    return this.supabase
      .from(BOARDS_TABLE)
      .update(board)
      .match({ id: board.id });
  }

  async deleteBoard(boardId: number) {
    return this.supabase.from(BOARDS_TABLE).delete().match({ id: boardId });
  }

  // CRUD Lists
  async getBoardLists(boardId: string) {
    const lists = await this.supabase
      .from(LISTS_TABLE)
      .select('*')
      .eq('board_id', boardId)
      .order('position');

    return lists.data || [];
  }

  async addBoardList(boardId: string, position = 0, length: number) {
    return this.supabase
      .from(LISTS_TABLE)
      .insert({ board_id: boardId, position, title: 'New List ' + length })
      .select('*')
      .single();
  }

  async updateBoardList(list: ListsModel) {
    return this.supabase.from(LISTS_TABLE).update(list).match({ id: list.id });
  }

  async deleteBoardList(list: ListsModel) {
    return this.supabase.from(LISTS_TABLE).delete().match({ id: list.id });
  }

  // CRUD Cards
  async addListCard(
    title: string,
    listId: string,
    boardId: string,
    price: number,
    priority: number,
    position = 0,
    owner_email: string
  ) {
    return this.supabase
      .from(CARDS_TABLE)
      .insert({
        board_id: boardId,
        list_id: listId,
        position,
        title,
        price,
        priority,
        owner_email,
        edited_at: new Date(),
      })
      .select('*')
      .single();
  }

  async addListCardFast(
    listId: string,
    boardId: string,
    position = 0,
    email: string,
    cardListLength: number
  ) {
    return this.supabase
      .from(CARDS_TABLE)
      .insert({
        board_id: boardId,
        list_id: listId,
        position,
        title: 'new Card ' + cardListLength,
        owner_email: email,
        price: 1000,
        priority: 0,
        edited_at: new Date(),
      })
      .select('*')
      .single();
  }

  async getListCards(listId: string) {
    const lists = await this.supabase
      .from(CARDS_TABLE)
      .select('*')
      .eq('list_id', listId)
      .order('position');

    return lists.data || [];
  }

  async updateCard(card: card) {
    card.edited_at = new Date();
    return this.supabase.from(CARDS_TABLE).update(card).match({ id: card.id });
  }

  async deleteCard(card: card) {
    return this.supabase
      .from(CARDS_TABLE)
      .delete()
      .match({ id: card.id, list_id: card.list_id });
  }

  // Invite others
  async addUserToBoard(boardId: string, email: string) {
    const user = await this.supabase
      .from(USERS_TABLE)
      .select('id')
      .match({ email })
      .single();

    if (user.data?.id) {
      const userId = user.data.id;
      const userBoard = await this.supabase.from(USER_BOARDS_TABLE).insert({
        user_id: userId,
        board_id: boardId,
        email,
      });
      await this.supabase.from('users_in_board').insert({
        board_id: boardId,
        email: email,
      });
      return userBoard;
    } else {
      return null;
    }
  }

  async getUsersFromBoard(board_id: string) {
    const users = await this.supabase
      .from('users_in_board')
      .select('*')
      .match({ board_id });
    return users.data || [];
  }

  getTableChanges() {
    const changes = new Subject();

    this.supabase
      .channel('table-db-changes1')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: CARDS_TABLE,
        },
        (payload: any) => changes.next(payload)
      )
      .subscribe();

    this.supabase
      .channel('table-db-changes2')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: LISTS_TABLE,
        },
        (payload: any) => changes.next(payload)
      )
      .subscribe();

    this.supabase
      .channel('table-db-changes3')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: BOARDS_TABLE,
        },
        (payload: any) => changes.next(payload)
      )
      .subscribe();
    return changes.asObservable();
  }
}
