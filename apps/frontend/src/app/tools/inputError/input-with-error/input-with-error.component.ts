import { AfterViewInit, Component, ElementRef, forwardRef, HostListener, Injector, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControlDirective, FormControl, FormControlName, FormGroupDirective, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input-with-error',
    templateUrl: './input-with-error.component.html',
    styleUrls: ['./input-with-error.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputWithErrorComponent),
        multi: true,
      },]
})
export class InputWithErrorComponent implements AfterViewInit {
    constructor(private injector: Injector) {}


    @Input() text: string;

    @ViewChild('text') textField: ElementRef<HTMLSpanElement>;
    @ViewChild('error') errorField: ElementRef<HTMLSpanElement>;
    @ViewChild('input') inputField: ElementRef<HTMLInputElement>;

    @Input()
    public control!: FormControl;

    ngOnInit(){
        const injectedControl = this.injector.get(NgControl);
        if(injectedControl instanceof FormControlName) {
            console.log('formControlName');
            this.control = this.injector
            .get(FormGroupDirective)
            .getControl(injectedControl);
        } else {
            console.log('NICHT formControlName');
            this.control = (injectedControl as FormControlDirective)
                .form as FormControl;
        }

        console.log(this.control, this.control.value);
    }

    ngAfterViewInit(): void {
        this.inputField.nativeElement.placeholder = this.text;
    }

    @HostListener('input', ['$event'])
    onInput(event: any): void {
        if (event.target.value.length === 1) {
            this.textField.nativeElement.innerText = this.text;
            this.textField.nativeElement.classList.remove('hidden');
            this.textField.nativeElement.classList.add('visible');
            this.inputField.nativeElement.placeholder = '';
        }
    }
}
