import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-update-action-item-list',
  templateUrl: './update-action-item-list.component.html',
  styleUrls: ['./update-action-item-list.component.scss']
})
export class UpdateActionItemListComponent {
  updateActionItem: any;
  displayedColumns  = ['Index', 'ActionItemIndex', 'ActionItem', 'ActionItemOwner'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dialogRef: MatDialogRef<UpdateActionItemListComponent>
  ) {
    this.updateActionItem = new MatTableDataSource(parent.actionItems || []);
  }
}
