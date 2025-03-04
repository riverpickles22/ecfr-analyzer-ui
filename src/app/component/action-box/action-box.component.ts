import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBoxAction } from '@app/models/enums/action-box-actions.enum';
@Component({
  selector: 'app-action-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-box.component.html',
  styleUrl: './action-box.component.scss'
})
export class ActionBoxComponent implements OnInit{

  @Input() selectedRecordId: string;
  @Input() actionList: string[] = [];

  @Output() viewSelected = new EventEmitter<string>();
  @Output() editMetadataSelected = new EventEmitter<string>();
  @Output() manageAccessSelected = new EventEmitter<string>();
  @Output() downloadSelected = new EventEmitter<string>();
  @Output() shareSelected = new EventEmitter<string>();
  @Output() deleteSelected = new EventEmitter<string>();
  @Output() cancelSelected = new EventEmitter<string>();
  @Output() requestRecordSelected = new EventEmitter<string>();

  viewAction: boolean = false;
  editMetadataAction: boolean = false;
  manageAccessAction: boolean = false;
  downloadRecordAction: boolean = false;
  shareRecordAction: boolean = false;
  deleteRecordAction: boolean = false;
  cancelRecordAction: boolean = false;
  requestRecordAction: boolean = false;

  ngOnInit() {
    this.actionList.forEach(action => {
      switch (action) {
        case ActionBoxAction.View.toString():
          this.viewAction = true;
          break;
        case ActionBoxAction.EditMetadata.toString():
          this.editMetadataAction = true;
          break;
        case ActionBoxAction.ManageAccess.toString():
          this.manageAccessAction = true;
          break;
        case ActionBoxAction.Download.toString():
          this.downloadRecordAction = true;
          break;
        case ActionBoxAction.Share.toString():
          this.shareRecordAction = true;
          break;
        case ActionBoxAction.Delete.toString():
          this.deleteRecordAction = true;
          break;
        case ActionBoxAction.Cancel.toString():
          this.cancelRecordAction = true;
          break;
        case ActionBoxAction.Request.toString():
          this.cancelRecordAction = true;
          break;
        default:
          break;
      }
    });
  }

  view() {
    this.viewSelected.emit(this.selectedRecordId);
  }
  manageAccess() {
    this.manageAccessSelected.emit(this.selectedRecordId);
  }
  editMetadata() {
    this.editMetadataSelected.emit(this.selectedRecordId);
  }
  download() {
    this.downloadSelected.emit(this.selectedRecordId);
  }
  share() {
    this.shareSelected.emit(this.selectedRecordId);
  }
  delete() {
    this.deleteSelected.emit(this.selectedRecordId);
  }
  cancel(): void {
    this.cancelSelected.emit(this.selectedRecordId);
  }
  request(): void {
    this.requestRecordSelected.emit(this.selectedRecordId);
  }
}