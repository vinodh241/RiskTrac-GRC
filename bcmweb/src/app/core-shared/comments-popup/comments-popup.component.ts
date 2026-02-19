import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-comments-popup',
  templateUrl: './comments-popup.component.html',
  styleUrls: ['./comments-popup.component.scss']
})
export class CommentsPopupComponent {
  noComments: boolean = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public utils: UtilsService
  ) { }

  ngOnInit(): void {
    if (this.parent.commentData.length == 0) {
        this.noComments = true
    }
  }
}
