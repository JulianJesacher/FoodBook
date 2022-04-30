import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-image-slider',
    templateUrl: './image-slider.component.html',
    styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit {
    @Input() images: string[];
    currentIndex = 0;

    get amountOfImages() {
        return this.images?.length ?? 0;
    }

    ngOnInit(): void {
        if (!this.images || this.images.length === 0) {
            this.images = [
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
            ];
        }
    }

    changeIndex(delta: number): void {
        this.currentIndex += delta;

        this.currentIndex = (((this.currentIndex + delta) % this.amountOfImages) + this.amountOfImages) % this.amountOfImages;
    }
}
