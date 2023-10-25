import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'productscoffee',
})

export class CoffeeProductsPipe implements PipeTransform {
    transform(items: any[]): any {
        // Filtrar o array, items que atendem a condição ficam, os que não são removidos
        let coffeeItems = [];
        for(let i = 0; i< items.length; i++){
            if (items[i].type === 'cafe'){
                coffeeItems.push(items[i]);
            }
        }
        return coffeeItems;
    }
}