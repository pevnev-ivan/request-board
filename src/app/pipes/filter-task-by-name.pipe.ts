import { Pipe, PipeTransform } from '@angular/core';
import { card } from '../shared/models/data.model';

@Pipe({
  name: 'filterTaskByName',
})
export class FilterTaskByNamePipe implements PipeTransform {
  transform(listCards: card[], searchQuery: string) {
    if (searchQuery) {
      return listCards.filter((card: card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return listCards;
    }
  }
}
