import { Component, OnInit, HostListener, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IUserData, ISearchModes } from '@food-book/api-interface';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, switchMap, retry, startWith } from 'rxjs';
import { PostService } from '../../services/postService/post.service';
import { UserDataService } from '../../services/userDataService/userData.service';
import { AuthService } from '../../services/authService/authenticator.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header-main',
    templateUrl: './header-main.component.html',
    styleUrls: ['./header-main.component.scss'],
})
export class HeaderMainComponent implements OnInit {
    constructor(
        private postService: PostService,
        private userData: UserDataService,
        private authService: AuthService,
        private router: Router
    ) {}

    user: IUserData = this.userData.user;

    _currentSearchMode: BehaviorSubject<string> = new BehaviorSubject(ISearchModes.LATEST);
    @Output() searchModeChanged = new EventEmitter<string>();

    searchInput: FormControl = new FormControl(null, []);
    suggestions: string[] = [];

    lastScrollYValue: number;
    @ViewChild('navBar') navBar: ElementRef<HTMLDivElement>;

    ngOnInit(): void {
        this._currentSearchMode.subscribe((value) => {
            console.log('emit', value);
            this.searchModeChanged.emit(value);
        });

        this.searchInput.valueChanges
            .pipe(
                filter((input: string) => input !== ''),
                filter((input: string) => input.length > 0),
                map((input: string) => input.trim()),
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((input: string) => this.postService.getSearchSuggestions(input).pipe(retry(3), startWith([])))
            )
            .subscribe((postTitles) => {
                this.suggestions = postTitles.filter(this.elementUnique);
            });
    }

    private elementUnique = (value, index, self) => {
        return self.indexOf(value) === index
      }

    changeSearchMode(newValue: string): void {
        switch (newValue) {
            case ISearchModes.SAVED: {
                this._currentSearchMode.next(ISearchModes.SAVED);
                break;
            }
            case ISearchModes.SHUFFLE: {
                this._currentSearchMode.next(ISearchModes.SHUFFLE);
                break;
            }
            default:
                this._currentSearchMode.next(ISearchModes.LATEST);
        }
    }

    isButtonVisible(buttonName: string): boolean {
        return this._currentSearchMode.value != buttonName;
    }

    suggestionClicked(suggestionValue: string): void {
        this._currentSearchMode.next(ISearchModes.SEARCH_QUERY);
        this.postService.searchQuery$.next(suggestionValue + '%');
    }

    searchClicked(): void {
        this._currentSearchMode.next(ISearchModes.SEARCH_QUERY);
        this.postService.searchQuery$.next(`%${this.searchInput.value}%`);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/');
    }

    @HostListener('document:scroll', ['$event']) handleScrolled(): void {
        const scrollYValue = window.scrollY;
        if (scrollYValue > this.lastScrollYValue) {
            this.navBar.nativeElement.classList.add('invisible');
        } else {
            this.navBar.nativeElement.classList.remove('invisible');
        }
        this.lastScrollYValue = scrollYValue;
    }
}
