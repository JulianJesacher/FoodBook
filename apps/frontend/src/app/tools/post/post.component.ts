import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IPost } from '@food-book/api-interface';
import { DishService } from '../../services/dishService/dish.service';
import { ShareDialogComponent } from '../share-dialog/share-dialog/share-dialog.component';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
})
export class PostComponent {
    constructor(private dishService: DishService, private shareDialog: MatDialog, private router: Router) {}

    @Input() post!: IPost;
    imageIndex = 0;

    changeIndex(delta: number): void {
        this.imageIndex += delta;
        if (this.imageIndex < 0) {
            this.imageIndex = this.post.images.length - 1;
        } else if (this.imageIndex == this.post.images.length) {
            this.imageIndex = 0;
        }
    }

    saveButtonClicked() {
        this.dishService.changeSavedStatus(this.post.id, this.post.saved).subscribe({
            next: () => {
                this.post.saved = !this.post.saved;
            },
        });
    }

    getClassNumberFromRating(rating: number) {
        return Math.ceil(rating * 2);
    }

    openShareDialog() {
        this.shareDialog.open(ShareDialogComponent, { data: { dishId: 'test123' } });
    }

    navigateToProfile() {
        this.router.navigate(['/profile', this.post.postedBy.userId]);
    }
}
