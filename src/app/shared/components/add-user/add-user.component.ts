import { Component, Inject } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  userEmail: string;
  boardId = this.data.boardId;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Invites
  async addUser() {
    await this.dataService.addUserToBoard(this.boardId!, this.userEmail);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
