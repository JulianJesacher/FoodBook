import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from '../../services/userDataService/userData.service';
import { DishService } from '../../services/dishService/dish.service';
import { DeleteDialogComponent } from '../../tools/delete-dialog/delete-dialog.component';
import { IIngredient, IStep, IUserData } from '@food-book/api-interface';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Observable, forkJoin } from 'rxjs';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
    constructor(
        private deleteDialog: MatDialog,
        private dishService: DishService,
        private router: Router,
        private fb: FormBuilder,
        private userData: UserDataService,
        private activeRoute: ActivatedRoute
    ) {
        this.activeRoute.paramMap.subscribe((params) => {
            this.requestedDishId = params.get('id');
        });
    }

    @ViewChild('imageUpload') imageUpload: ElementRef<HTMLInputElement>;

    recipeForm: FormGroup;

    user: IUserData | null = this.userData.user;

    requestedDishId?: string;
    editMode: boolean = this.requestedDishId != undefined;

    ngOnInit(): void {
        this.recipeForm = this.getRecipeForm();
        if (!this.editMode) {
            this.addIngredient();
            this.addStep();
            this.dishService.createDish().subscribe((dish) => this.recipeForm.get('id').setValue(dish.id));
        } else {
            this.dishService.getDish(this.requestedDishId).subscribe({
                next: (requestedDish) => {
                    this.recipeForm = this.getRecipeForm(
                        requestedDish.id,
                        requestedDish.title,
                        requestedDish.description,
                        requestedDish.servings,
                        requestedDish.time,
                        requestedDish.isPublic
                    );

                    requestedDish.ingredients.forEach((ingredient) => {
                        this.addIngredient(ingredient.id, ingredient.name, ingredient.amount, ingredient.unit);
                    });

                    requestedDish.steps.forEach((step) => {
                        this.addStep(step.id, step.content);
                    });

                    requestedDish.images.forEach((image) => {
                        this.addImage(image);
                    });
                },
                error: () => console.log('error'),
            });
        }
    }

    openDeleteDialog(): void {
        this.deleteDialog.open(DeleteDialogComponent, { data: this.recipeForm.value.id });
    }

    getRecipeForm(
        id: string | null = null,
        title: string | null = null,
        description: string | null = null,
        servings: number | null = null,
        time: number | null = null,
        isPublic: boolean | null = false
    ): FormGroup {
        return this.fb.group({
            id: this.fb.control(id, []),
            title: this.fb.control(title, [Validators.required]),
            description: this.fb.control(description, [Validators.required]),
            ingredients: this.fb.array([], [Validators.required]),
            steps: this.fb.array([], [Validators.required]),
            servings: this.fb.control(servings, [Validators.required]),
            time: this.fb.control(time, [Validators.required]),
            images: this.fb.array([], []),
            isPublic: this.fb.control(isPublic, []),
        });
    }

    get ingredientsFormArray(): FormArray {
        return this.recipeForm?.get('ingredients') as FormArray;
    }

    get stepsFormArray(): FormArray {
        return this.recipeForm?.get('steps') as FormArray;
    }

    get imageFormArray(): FormArray {
        return this.recipeForm?.get('images') as FormArray;
    }

    addIngredient(id: string | null = null, name: string | null = null, amount: number = 1, unit: string = 'g'): void {
        this.ingredientsFormArray.push(
            this.fb.group({
                id: this.fb.control(id, []),
                name: this.fb.control(name, [Validators.required]),
                amount: this.fb.control(amount, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]),
                unit: this.fb.control(unit, [Validators.required]),
            })
        );
    }

    addStep(id: string | null = null, content: string | null = null): void {
        this.stepsFormArray.push(
            this.fb.group({
                id: this.fb.control(id, []),
                content: this.fb.control(content, [Validators.required]),
            })
        );
    }

    addImage(path: string): void {
        this.imageFormArray.push(this.fb.control(path, []));
    }

    removeIngredient(index: number): void {
        if (this.ingredientsFormArray.at(index).value.id != null) {
            this.dishService.deleteIngredient(this.recipeForm.value.id, this.ingredientsFormArray.at(index).value).subscribe();
        }
        this.ingredientsFormArray.removeAt(index);
    }

    removeStep(index: number): void {
        if (this.stepsFormArray.at(index).value.id != null) {
            this.dishService.deleteStep(this.recipeForm.value.id, this.stepsFormArray.at(index).value).subscribe();
        }
        for (let i = index; i < this.stepsFormArray.length; i++) {
            this.stepsFormArray.at(i).markAsDirty();
        }
        this.stepsFormArray.removeAt(index);
    }

    removeImage(index: number) {
        this.dishService.deleteImage(this.recipeForm.value.id, this.imageFormArray.at(index).value).subscribe();
        this.imageFormArray.removeAt(index);
    }

    removeAllImages() {
        for (const image of this.imageFormArray.value) {
            this.dishService.deleteImage(this.recipeForm.value.id, image).subscribe();
        }
        this.recipeForm?.setControl('images', this.fb.array([], []));
    }

    drop(event: CdkDragDrop<FormGroup>) {
        const arrayMaxIndex = this.stepsFormArray.length - 1;
        const fromIndex = clamp(event.previousIndex, 0, arrayMaxIndex);
        const toIndex = clamp(event.currentIndex, 0, arrayMaxIndex);

        if (toIndex === fromIndex) {
            return;
        }

        const target = this.stepsFormArray.at(fromIndex);
        this.stepsFormArray.removeAt(fromIndex, { emitEvent: false });
        this.stepsFormArray.insert(toIndex, target);

        for (let i = Math.min(fromIndex, toIndex); i <= Math.max(fromIndex, toIndex); i++) {
            this.stepsFormArray.at(i).markAsDirty();
        }
    }

    handleImageUpload(): void {
        const files: FileList = this.imageUpload.nativeElement.files;
        if (!files) {
            return;
        }

        this.dishService.postImages(Array.from(files), this.recipeForm.value.id).subscribe((newImages) => {
            newImages.forEach((image) => this.addImage(image));
        });
    }

    uploadDish(): void {
        if (!this.recipeForm?.valid) {
            return;
        }

        this.dishService.updateDish(this.recipeForm?.value, this.recipeForm.value.id).subscribe(() => {
            forkJoin([...this.updateSteps(), ...this.updateIngredients()]).subscribe({
                complete: () => {
                    this.router.navigateByUrl('/main');
                },
            });
        });
    }

    updateSteps(): Observable<IStep>[] {
        const dishId: string = this.recipeForm.value.id;
        let number = 1;
        const result: Observable<IStep>[] = [];
        for (const step of this.stepsFormArray.controls) {
            if (step.dirty) {
                if (step.value.id === null) {
                    result.push(this.dishService.createStep(dishId, { number, ...step.value }));
                } else {
                    result.push(this.dishService.updateStep(dishId, { number, ...step.value }));
                }
            }
            number++;
        }
        return result;
    }

    updateIngredients(): Observable<IIngredient>[] {
        const dishId: string = this.recipeForm.value.id;
        const results: Observable<IIngredient>[] = [];
        for (const ingredient of this.ingredientsFormArray.controls) {
            if (ingredient.dirty) {
                if (ingredient.value.id === null) {
                    results.push(this.dishService.createIngredient(dishId, ingredient.value));
                } else {
                    results.push(this.dishService.updateIngredient(dishId, ingredient.value));
                }
            }
        }
        return results;
    }

    toggleVisibility() {
        const dishId: string = this.recipeForm.value.id;
        const newVisibility = !this.recipeForm.value.isPublic;
        let newState: 'public' | 'private' = 'public';

        if (!newVisibility) {
            newState = 'private';
        }

        this.dishService.setVisibility(dishId, newState).subscribe((dish) => this.recipeForm.controls['isPublic'].setValue(dish.isPublic));
    }
}

const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
};
