import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { KriPopupComponent } from '../kri-popup/kri-popup.component';
import { range } from 'rxjs';
import { KriMigrationUnitComponent } from '../kri-migration-unit/kri-migration-unit.component';

export interface KriElement {
  id: number,
  unit: string,
  kri: number
}



@Component({
  selector: 'app-kri-unit',
  templateUrl: './kri-unit.component.html',
  styleUrls: ['./kri-unit.component.scss']
})
export class KriUnitComponent implements OnInit {
  @Input() data: any
  @Input() fulldata:any
  oldfulldata:any
  pageEvent: PageEvent | undefined;
  displayedColumns: string[] = ['id', 'unit', 'Count'];
  source: any
  // dataSource = ;
  // dataSource = new MatTableDataSource(ELEMENT_DATA) ;
  dataSource: MatTableDataSource<KriElement> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | undefined;
  constructor(public dialog: MatDialog) { }


  getAllFourData(source: any) {
    const list = []
    const list1 = []
    for (let i in [1,2,3]) {
      list.push(source[i])
      // console.log(i)
    }
    let n=1
    for (let i of list){
      i.sno=n
      n++
      list1.push(i)
    }
    return list1
    // return list
  }

  ngOnInit(): void {
    console.log(this.data)
    this.oldfulldata = this.data.data
    // this.source = this.getAllFourData(this.data.dat)
    this.source = this.data.dat    
    this.source.sort((a:any, b:any) =>  b.Count - a.Count);
    for(let i = 0; i<this.source?.length; i++){ 
      this.source[i].sno = i+1
    } 
    // console.log(this.source)
    setTimeout(() => {
      this.dataSource.paginator = this.paginator
    }, 100);
    // this.dataSource.paginator = this.paginator;


  }

  getIndex(dt:any){
    let index=1
    let list =[]
    for (let i of dt){
      i.sno=index
      list.push(i)
      index++
    }
    console.log(list)
    return list
  }
  getName(ad:any){
    let dts
    if(ad==1){
      dts='Migration of units - To Yellow/Green Zone'
    }else if (ad==2){
      dts='Migration of units - To Red Zone'
    }

    return dts 

  }

  openPopUp(id:any): void {
    let filterDate
    console.log(id)
    if(id==1){
      filterDate=this.oldfulldata.filter((dt:any)=>dt.KRI_Value===4 || dt.KRI_Value===5
      )

    }else if(id==2){
      filterDate=this.oldfulldata.filter((dt:any)=>dt.KRI_Value===1
      )


    }
    
    const kriPopup = this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '40vw',
      data: {mode:'unit-1',value:this.getIndex(this.data.dat),kri:filterDate,name:this.getName(id),id:id},
    })
    // console.log('Dinesh')
  }


}


