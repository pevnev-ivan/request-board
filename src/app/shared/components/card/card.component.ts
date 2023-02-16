import { Component, Input, OnInit } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { card } from '../../models/data.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() card!: card;
  @Input() user!: User;
  @Input() cardListId!: number;

  constructor() {}

  async ngOnInit() {}
}
