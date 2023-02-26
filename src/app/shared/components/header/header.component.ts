import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() user: User | null;
  @Input() boardId: string;
  @Input() headerToggle: boolean;

  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  showSubMenu = false;
  panelOpenState = false;

  constructor(private readonly dialog: MatDialog) {}

  onSignOut() {
    this.signOut.emit();
  }

  public openDialog() {
    this.dialog.open(AddUserComponent, {
      data: {
        boardId: this.boardId,
      },
    });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
