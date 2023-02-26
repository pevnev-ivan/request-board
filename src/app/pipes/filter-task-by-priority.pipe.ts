import { Pipe, PipeTransform } from '@angular/core';
import { card } from '../shared/models/data.model';
import { Priorities } from '../shared/constants/constants';

@Pipe({
  name: 'filterTaskByPriority',
})
export class FilterTaskByPriorityPipe implements PipeTransform {
  transform(listCards: card[], priorityId: number = Priorities.length) {
    if (priorityId == Priorities.length) {
      return listCards;
    } else {
      return listCards.filter((card: card) => card.priority == priorityId);
    }
  }
}
