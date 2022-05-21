import { Component, Input, OnInit } from '@angular/core';
import { FilterQueryParameter, IPost, ISearchModes, IUserData, OrderQueryParameter, QueryParameters } from '@food-book/api-interface';
import { PostService } from '../../../services/postService/post.service';
import { UserDataService } from '../../../services/userDataService/userData.service';

@Component({
    selector: 'app-post-container',
    templateUrl: './post-container.component.html',
    styleUrls: ['./post-container.component.scss'],
})
export class PostContainerComponent implements OnInit {
    constructor(private postService: PostService, private userData: UserDataService) {}

    _filterParameter!: FilterQueryParameter;
    @Input() set filterParameter(newValue: FilterQueryParameter[]) {
        console.log('filterChanged');
        this.queryParameters.filter = newValue;
        this.resetPosts();
        this.addNextPosts();
    }

    _searchMode = ISearchModes.LATEST;
    @Input() set searchMode(newValue: string) {
        this._searchMode = newValue;
        this.resetPosts();
        this.addNextPosts();
    }

    _orderByLatest: OrderQueryParameter = {
        field: 'createdAt',
        direction: 'DESC',
    };
    _orderByTime: OrderQueryParameter = {
        field: 'time',
        direction: 'ASC',
    };
    _orderState: OrderState = OrderState.LATEST;
    orderStates = OrderState;

    readonly limit: number = 10;
    queryParameters: QueryParameters = {
        limit: this.limit,
        offset: 0,
        order: [this._orderByLatest],
    };

    posts: IPost[] = [];
    user: IUserData = this.userData.user;

    ngOnInit(): void {
        this.postService.newPosts$.subscribe((posts) => {
            this.posts.push(...posts);
        });
        this.addNextPosts();
    }

    addNextPosts(): void {
        switch (this._searchMode) {
            case ISearchModes.LATEST: {
                this.postService
                    .getNextPosts({
                        ...this.queryParameters,
                        filter: [...(this.queryParameters.filter ?? []), { field: 'postedById', op: '<>', value: this.user.userId }],
                    })
                    .subscribe();
                break;
            }
            case ISearchModes.PROFILE: {
                this.postService.getNextPosts(this.queryParameters).subscribe();
                break;
            }
            case ISearchModes.SAVED:
            case ISearchModes.SHUFFLE: {
                const random: boolean = this._searchMode === ISearchModes.SHUFFLE;
                this.postService.getNextSavedPosts(this.queryParameters, this.user.userId, random).subscribe();
                break;
            }
            case ISearchModes.SEARCH_QUERY: {
                const searchQuery: string = this.postService.searchQuery$.value;
                this.queryParameters.filter = [{ field: 'title', op: 'LIKE', value: searchQuery }];
                this.postService.getNextPosts(this.queryParameters).subscribe();
                break;
            }
            default: {
                throw new Error('No valid searchmode was specified');
            }
        }
        this.queryParameters.offset += this.limit;
    }

    changeOrder(value: OrderQueryParameter): void {
        this.queryParameters.order = [value];
        this.resetPosts();
        this.addNextPosts();
    }

    orderLatest() {
        this._orderState = OrderState.LATEST;
        this.changeOrder(this._orderByLatest);
    }

    orderTime() {
        this._orderState = OrderState.TIME;
        this.changeOrder(this._orderByTime);
    }

    private resetPosts(): void {
        this.posts = [];
        this.queryParameters.offset = 0;
    }
}

enum OrderState {
    LATEST,
    TIME,
}
