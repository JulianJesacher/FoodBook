import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AuthenticatorServiceInterface } from '../../services/authService/authenticator.service';
import { BehaviorSubject } from 'rxjs';

@Directive({
    selector: 'img[protectedImage]',
})
export class ProtectedImageDirective {
    @HostListener('error')
    handleError = this._refreshTokenAndReplaceImageSrc;

    finalSrc = new BehaviorSubject<string | null>(null);

    @Input() set src(newValue: string) {
        if (!newValue) {
            return
        }
        this._src = newValue;
        this.resetErrorHandling();
        this.computeFinalSrc();
    }
    get src(): string {
        return this._src ?? '';
    }
    private _src: string | undefined;

    constructor(public el: ElementRef, private authService: AuthenticatorServiceInterface) {}

    ngOnInit(): void {
        if (this.src === undefined) {
            throw new Error('No source defined. Please define the src input variable.');
        }
        this.finalSrc.subscribe((src) => {
            if (src) {
                this.el.nativeElement.src = src;
            }
        });
    }

    private _refreshTokenAndReplaceImageSrc($event: ErrorEvent) {
        console.log('refreshToken');
        this.authService.refreshToken().subscribe(() => {
            this.computeFinalSrc();
        });
        this.handleError = this._showError;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private _showError(_event: ErrorEvent) {
        this.finalSrc.next(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png'
        );
    }

    private computeFinalSrc() {
        if (this._src) {
            this.finalSrc.next(`${this._src}?access_token=${this.authService.accessToken$.value}`);
        }
    }

    private resetErrorHandling() {
        this.handleError = this._refreshTokenAndReplaceImageSrc;
    }
}
