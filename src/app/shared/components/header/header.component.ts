import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "@supabase/supabase-js";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @Output() signOut: EventEmitter<any> = new EventEmitter<any>()
  @Input() user!: User

  showSubMenu = false

  constructor() {

  }

  ngOnInit() {

  }

  onSignOut () {
    this.signOut.emit()
  }
}
