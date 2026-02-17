import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
    noComments:boolean = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utils:UtilsService
  ) { }

  ngOnInit(): void {
    console.log("data",this.data)
if(this.data.comments.length == 0){
    this.noComments = true
}
  }

}
