import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DishService } from '../../services/dishService/dish.service';

export interface IRatingData {
    dishId: string;
    ratingNumber: number;
}

@Component({
    selector: 'app-rating-input',
    templateUrl: './rating-input.component.html',
    styleUrls: ['./rating-input.component.scss'],
})
export class RatingInputComponent implements OnInit {
    stars: boolean[] = Array(5).fill(false);
    @ViewChild('ratingContainer') container: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<RatingInputComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IRatingData,
        private dishService: DishService
    ) {}

    ngOnInit() {
        if (!this.data) {
            this.dialogRef.close();
        }
        this.rate(this.data.ratingNumber);
    }

    rate(rating: number) {
        this.stars = this.stars.map((star, index) => rating > index);
        this.data.ratingNumber = rating;
    }

    submit() {
        if (this.data.ratingNumber < 1 || this.data.ratingNumber > 5) {
            this.showError();
        } else {
            this.dishService.rateDish(this.data.dishId, this.data.ratingNumber).subscribe({
                next: (newRating) => {
                    const prevValue = this.dishService.dish$.value;
                    if (prevValue) {
                        this.dishService.dish$.next({ ...this.dishService.dish$.value, myRating: newRating.ratingNumber });
                    }

                    this.dialogRef.close();
                },
            });
        }
    }

    showError() {
        this.container.nativeElement.classList.add('error');
        setTimeout(() => {
            this.container.nativeElement.classList.remove('error');
        }, 350);
    }
}
