import { Directive, ElementRef} from '@angular/core';
@Directive({
  selector: '[formPassword]'
})
export class FormPasswordDirective {
 private _shown = false;
constructor(private el: ElementRef) {
    this.setup();
  }
toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = '<i class="far fa-eye"></i>';
    }
  }
setup() {
    const parent = this.el.nativeElement.parentNode;

    const inputAppend = document.createElement('div');
    inputAppend.className = 'input-group-append';

    const span = document.createElement('span');
    span.className = 'input-group-text';
    span.innerHTML = '<i class="far fa-eye"></i>';
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });

    inputAppend.appendChild(span);
    parent.appendChild(inputAppend);
  }
}
