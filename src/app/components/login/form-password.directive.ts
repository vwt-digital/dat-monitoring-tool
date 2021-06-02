import { Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appFormPassword]'
})

export class FormPasswordDirective {
  private shown = false;

  constructor(private el: ElementRef) {
    this.setup();
  }

  toggle(span: HTMLElement): void {
    this.shown = !this.shown;
    if (this.shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = '<i class="far fa-eye"></i>';
    }
  }

  setup(): void {
    const parent = this.el.nativeElement.parentNode;

    const inputAppend = document.createElement('div');
    inputAppend.className = 'input-group-append';

    const span = document.createElement('span');
    span.className = 'input-group-text h-100';
    span.innerHTML = '<i class="far fa-eye"></i>';
    span.addEventListener('click', () => {
      this.toggle(span);
    });

    inputAppend.appendChild(span);
    parent.appendChild(inputAppend);
  }
}
