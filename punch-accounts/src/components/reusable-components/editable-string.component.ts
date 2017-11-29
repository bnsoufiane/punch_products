import {
  Component, Input, ViewChild, Output, Renderer, ViewEncapsulation, AfterViewInit, EventEmitter,
  AfterViewChecked
} from 'angular2/core';

@Component({
  selector: 'ar-editable-string',
  moduleId: module.id,
  templateUrl: './editable-string.component.html',
  styleUrls: ['../../common/stylesheets/components/editable-string.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditableStringComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('textarea') textarea;
  @Input() text:string = '';
  @Input() name:string = 'textarea';
  @Input() placeholder:string = 'Enter some text...';
  @Output() changed = new EventEmitter<string>();

  constructor(private _renderer:Renderer) {
  }

  ngAfterViewInit() {
    this._adjustHeight();
  }

  ngAfterViewChecked() {
    this._adjustHeight();
  }

  onChange(text:string) {
    this.text = text;
    this.changed.emit(this.text);
    this._adjustHeight();
  }

  onFocus() {
    this._adjustHeight();
  }

  private _adjustHeight() {
    this._renderer.setElementStyle(this.textarea.nativeElement, 'height', '24px');
    this._renderer.setElementStyle(this.textarea.nativeElement, 'height', this.textarea.nativeElement.scrollHeight + 4 + 'px');
  }
}
