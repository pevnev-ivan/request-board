import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddTaskComponent} from "../add-task/add-task.component";

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent {
  constructor(private readonly dialog: MatDialog) {
  }
  public openDialog() {

    const dialogRef = this.dialog.open(AddTaskComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
