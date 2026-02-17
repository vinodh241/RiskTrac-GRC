import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { KriPopupComponent } from '../kri-popup/kri-popup.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-kri-migration-unit',
  templateUrl: './kri-migration-unit.component.html',
  styleUrls: ['./kri-migration-unit.component.scss']
})
export class KriMigrationUnitComponent implements OnInit {
  displayedColumns: string[] = ['id', 'unit', 'Count'];
  displayedColumns2: string[] = ['id', 'unit', 'Count', 'per'];

  

  dataSource = this.data.value

  mode: any = this.data.mode

  constructor(
    private dialogRef: MatDialogRef<KriMigrationUnitComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dashboard: DashboardService,
    public kriService:KriService,
    public utils: UtilsService,
  ) { 
    // console.log(kriService.kriMeasurement)
  }

  ngOnInit(): void {
    this.dataSource.sort((a:any, b:any) =>  b.Count - a.Count);
    console.log("dinesh", this.dataSource)
         
    let index = 1 
    for (let i =0; this.dataSource?.length > 0; i++) {
      this.dataSource[i].sno = index + i
    }
  }

  

  openDataPopUp(da: any, el: any) { 
    // this.dashboard.KeyRiskIndicatorsteps.step2=da
    // console.log(this.dashboard.KeyRiskIndicatorsteps.step2=da)
    let dts
    if (this.data.id) {
      if (this.data.id === 1) {
        dts = `Migration of units - To Yellow/Green Zone(${da})`
      } else if (this.data.id === 2) {
        dts = `Migration of units - To Red Zone(${da})`
      }
    } else {
      dts = da
    }

    console.log(this.data.kri,el)
    const dta = this.data.kri.filter((dat: any) => dat.Unit === da)
    console.log("mig", dta)
    const data = this.getIndex(dta)
    const kriPopup = this.dialog.open(KriPopupComponent, {
      disableClose: false,

      height: '80vh',
      width: '70vw',
      data: { data: data, name: dts }
    })

  }

  getIndex(dt: any) {
    let index = 1
    let list = []
    for (let i of dt) {
      i.sno = index
      list.push(i)
      index++
    }
    console.log(list)
    return list
  }

  getRow(row: any) {
    console.log(row)
    let name
    if (this.data.abc == 1) {
      name = 'List of KRI in Red Zone'
    } else if (this.data.abc == 2) {
      name = 'List of KRI in Amber Zone'
    }
    let data = this.data.kri.filter((dt: any) => dt.Unit == row.Unit && dt.KRI_Value == this.data.abc)

    // const data = this.getIndex(result)
    const kriPopup = this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: { data: data, name: row.Unit + " - " + name }
    })
  }


  getSymbol(el: any) {
    if (el == -1) {
      return '-'
    } else {
      return el + '%'
    }

  }

  

}
