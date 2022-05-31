import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DishService } from '../../services/dishService/dish.service';
import { RatingInputComponent } from '../rating-input/rating-input.component';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<RatingInputComponent>,
        @Inject(MAT_DIALOG_DATA) public dishId: string,
        private dishService: DishService,
        private router : Router
    ) {}

    deleteDish() {
        this.dishService.deleteDish(this.dishId).subscribe();
        this.dialogRef.close();
        this.router.navigateByUrl('/home');
    }
}
