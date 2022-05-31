import { Component } from '@angular/core';
import { FilterQueryParameter, ISearchModes, IUserData } from '@food-book/api-interface';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent {
    user: IUserData | null = null;
    searchMode = ISearchModes.LATEST;

    changeSearchMode(mode: string): void {
        this.searchMode = mode;
    }
}
