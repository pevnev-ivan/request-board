import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit{
  @Input() card!: any;



  @Input() task!: any;
  @Input() cardListId!: number;


  constructor(
    ) {  }

  async ngOnInit() {
    // try {
    //   this.userInfo = await this.UserService.getUserInfo(this.task.ownerId);
    // } catch (error) {
    //   console.error(error);
    // }
  }





}
