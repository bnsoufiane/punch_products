import {Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {EditableStringComponent} from './editable-string.component';
import {ConfirmationModalComponent} from '../modals/confirmation.modal.component';

@Component({
  selector: 'ar-editable-table',
  moduleId: module.id,
  templateUrl: './editable-table.component.html',
  styleUrls: ['../../common/stylesheets/components/editable-table.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [CORE_DIRECTIVES, EditableStringComponent, ConfirmationModalComponent]
})
export class EditableTableComponent implements OnInit {
  /**
   * table headers
   */
  @Input() headers:{text:string}[] = [{text:''}, {text:''}, {text:''}];
  /**
   * table rows number
   */
  @Input() rowsNumber:number = 1;
  /**
   * table title
   */
  @Input() title:string = '';
  /**
   * table data
   */
  @Input() data:Array<string[]> = [];
  /**
   * table content change event
   */
  @Output() changed = new EventEmitter<any>();
  /**
   * table title change event
   */
  @Output() titleChanged = new EventEmitter<string>();
  /**
   * show modal flag for deleting a row/column
   */
  showModal:boolean = false;
  /**
   * confirm message for deleting a row/column
   */
  confirmMessage:string = 'Are you sure you want to delete?';
  /**
   * index for the row to be deleted
   */
  rowToDelete:number = null;
  /**
   * index for the column to be deleted
   */
  columnToDelete:number = null;
  /**
   * Array content
   */
  content: Array<{text:string}[]> = [];


  /**
   * initializing table data
   */
  public ngOnInit():void {
    if(this.data.length > 0) {
      this.rowsNumber = this.data.length - 1;

      this.headers = this.data[0].map((data, i) => {
        return {text:this.data[0][i]};
      });

      for(let i = 1; i < this.rowsNumber + 1; i++) {
        let row:{text:string}[] = [];
        row = this.data[i].map((data, j) => {
          return {text:this.data[i][j]};
        });
        this.content.push(row);
      }
    } else {
      for(let i = 0; i < this.rowsNumber; i++) {
        let temp:{text:string}[] = [];
        for(let j = 0; j < this.headers.length; j++) {
          temp.push({text:''});
        }
        this.content.push(temp);
      }
    }
  }

  /**
   * firing title change event
   * @param txt
   */
  protected onTitleChange(txt:string):void {
    this.title = txt;
    this.titleChanged.emit(this.title);
  }

  /**
   * updating a header cell
   * @param i
   * @param txt
   */
  protected updateHeader(i:number, txt:string):void {
    this.headers[i].text = txt;
    this.onChanged();
  }

  /**
   * updating a content cell
   * @param i
   * @param j
   * @param txt
   */
  protected updateContent(i:number, j:number, txt:string):void {
    this.content[i][j].text = txt;
    this.onChanged();
  }

  /**
   * firing table changed event
   */
  protected onChanged():void {
    let table = [];
    let temp = [];
    for(let i = 0; i < this.headers.length; i++) {
      temp.push(this.headers[i].text);
    }
    table.push(temp);
    for(let i = 0; i < this.content.length; i++) {
      temp = [];
      for(let j = 0; j < this.headers.length; j++) {
        temp.push(this.content[i][j].text);
      }
      table.push(temp);
    }
    this.changed.emit(table);
  }

  /**
   * adding a row to the table
   */
  protected addRow():void {
    let temp = [];
    for(let j = 0; j < this.headers.length; j++) {
      temp.push({text:''});
    }
    this.content.push(temp);
    this.rowsNumber++;
  }

  /**
   * adding a column to the table
   */
  protected addColumn():void {
    this.headers.push({text:''});
    for(let row of this.content) {
      row.push({text:''});
    }
  }

  /**
   * firing confirm modal for deleting a row
   * @param i
   * @returns {boolean}
   */
  protected deleteRowConfirm(i:number):boolean {
    this.confirmMessage = 'Are you sure you want to deleted the selected row?';
    this.showModal = true;
    this.rowToDelete = i;
    return false;
  }


  /**
   * firing confirm modal for deleting a column
   * @param i
   * @returns {boolean}
   */
  protected deleteColumnConfirm(i:number):boolean {
    if(this.headers.length < 2)
      return false;
    this.confirmMessage = 'Are you sure you want to deleted the selected column?';
    this.showModal = true;
    this.columnToDelete = i;
    return false;
  }

  /**
   * deleting a row
   * @param i
     */
  protected deleteRow(i:number):void {
    this.content.splice(i, 1);
    this.rowsNumber--;
    this.onChanged();
  }

  /**
   * deleting a column
   * @param i
     */
  protected deleteColumn(i:number):void {
    for(let j = 0; j < this.rowsNumber; j++) {
      this.content[j].splice(i, 1);
    }
    this.headers.splice(i, 1);
    this.onChanged();
  }

  /**
   * confirm action for modal
   * @param confirmed
     */
  protected confirmAction(confirmed:boolean):void {
    this.showModal = false;
    if (confirmed) {
      if(this.rowToDelete !== null) {
        this.deleteRow(this.rowToDelete);
        this.rowToDelete = null;
      }
      if(this.columnToDelete !== null) {
        this.deleteColumn(this.columnToDelete);
        this.columnToDelete = null;
      }
    }
  }
}
