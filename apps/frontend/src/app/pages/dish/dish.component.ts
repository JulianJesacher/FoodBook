import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IDish, IIngredientUpload, IUserData } from '@food-book/api-interface';
import { DishService } from '../../services/dishService/dish.service';
import { UserDataService } from '../../services/userDataService/userData.service';
import { RatingInputComponent } from '../../tools/rating-input/rating-input.component';
import { filter } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dish',
    templateUrl: './dish.component.html',
    styleUrls: ['./dish.component.scss'],
})
export class DishComponent implements OnInit {
    constructor(
        private ratingDialog: MatDialog,
        private dishService: DishService,
        private userData: UserDataService,
        private activeRoute: ActivatedRoute
    ) {
        this.activeRoute.paramMap.subscribe((params) => {
            this.dishId = params.get('id');
        });
    }

    get newInputControl() {
        return new FormControl(this.dish?.servings ?? null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]);
    }

    servingsInput: FormControl = this.newInputControl;
    dishId: string;
    dish: IDish;
    updatedIngredients: IIngredientUpload[];
    user: IUserData = this.userData.user;

    async ngOnInit(): Promise<void> {
        this.dishService.dish$.pipe(filter((x) => !!x)).subscribe({
            next: (dish: IDish) => {
                this.dish = dish;
                this.updatedIngredients = dish.ingredients;
                this.servingsInput = this.newInputControl;
                this.subscribeInput();
            },
            error: console.log,
        });

        this.dishService.getDish(this.dishId).subscribe();
    }

    subscribeInput() {
        this.servingsInput.valueChanges.subscribe((value) => {
            if (this.servingsInput.valid) {
                const ratio = parseInt(value, 10) / this.dish.servings;
                for (const i in this.dish.ingredients) {
                    this.updatedIngredients[i].amount = this.dish.ingredients[i].amount * ratio;
                }
            }
        });
    }

    openRatingDialog() {
        this.ratingDialog.open(RatingInputComponent, { data: { dishId: this.dish.id, ratingNumber: this.dish.myRating } });
    }
}
