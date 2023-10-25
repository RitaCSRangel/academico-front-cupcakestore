import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'productscupcake',
    pure: false
})

export class CupcakeProductsPipe implements PipeTransform {
    transform(items: any[]): any {
        // Filtrar o array, items que atendem a condição ficam, os que não são removidos
        let cupcakeItems = [];
        for(let i = 0; i< items.length; i++){
            if (items[i].type === 'cupcake'){
                cupcakeItems.push(items[i]);
            }
        }
        return cupcakeItems;
    }
}