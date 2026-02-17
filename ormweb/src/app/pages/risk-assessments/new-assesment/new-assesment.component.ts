import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RiskAssessmentService } from 'src/app/services/risk-assessment/risk-assessment.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

export interface User {
    user: number;
    name: string;
}

export interface Unit {
    unit: number;
    name: string;
}

export interface Quater {
    QuaterID: number;
    year: number;
    Quater: number
}

@Component({
    selector: 'app-new-assesment',
    templateUrl: './new-assesment.component.html',
    styleUrls: ['./new-assesment.component.scss']
})

export class NewAssesmentComponent implements OnInit {
    copy: any;
    quatersz: any = []
    units: Unit[] = [];
    users: User[] = [];
    unitx = new FormControl<string | Unit>('');
    userx = new FormControl<string | User>('');


    // @ts-ignore
    unitz: Observable<Unit[]>;
    // @ts-ignore
    userz: Observable<User[]>;

    years: any = []
    quaters = [1, 2, 3, 4]
    startQuaterDate: any
    endQuaterDate: any
    year = new FormControl();
    quater = new FormControl();
    startDate = new FormControl();
    endDate = new FormControl();
    remainderDate = new FormControl();

    saveerror = "";
    reviewerunit = ""
    quarter: any;
    currentYear: any;
    filterquarter:any;
    count: any;
    // endDateerror = "";

    constructor(
        private router: Router,
        private service: RiskAssessmentService,
        public utils: UtilsService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<NewAssesmentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject(DOCUMENT) private _document: any
    ) {
        if (data) {
            this.copy = JSON.parse(JSON.stringify(data))
            console.log("this.copy",this.copy)
            if (this.copy.mode == "edit") {

                // const newQuarter = { 
                //     "QuaterID": this.copy.QuaterID, 
                //     "Year": this.copy.Year, 
                //     "Quater": this.copy.Quater 
                //   };
                //   console.log('this.filterquarter: ', this.filterquarter);
                  
                //   const isQuarterExists = this.filterquarter.some((q:any) => 
                //     q.QuaterID === newQuarter.QuaterID
                //   );
                //   console.log('isQuarterExists: ', isQuarterExists);

                  
                //   if (!isQuarterExists) {
                //     this.filterquarter.push(newQuarter);
                //   }
                //   console.log(' this.filterquarter: ',  this.filterquarter);

                console.log(this.copy)
                // this.quaterDate='2023-01-04T05:30:00.000Z'
                this.startDate = new FormControl(new Date(this.copy.StartDate))
                this.endDate = new FormControl(new Date(this.copy.EndDate))
                this.year = new FormControl(this.copy.Year)
                this.quater = new FormControl(this.copy.Quater)
                this.remainderDate = new FormControl(this.copy.ReminderDate)
                
                // this.quaterDetailsData()
            }
        }
        // this.dialogRef.updateSize('70vh', '70vh')
    }

    ngOnInit(): void {
        this.count = 2;
        const currentYear = new Date().getFullYear();

        // for (let i = 0; i < this.count; i++) {
        //   this.years.push({ "Year": currentYear + i });
        // }

		let currentDate = new Date(); // Get the current date
		console.log('currentDate: '+currentDate)
		let currMonth = currentDate.getMonth() + 1;
		let currQuarter = Math.ceil(currMonth / 3);
		console.log(currQuarter)
		if (currQuarter != 2 && currQuarter != 3) {
			for (let i = 0; i < this.count; i++) {
				if (currQuarter == 1) this.years.push({ "Year": currentYear - i });			
				if (currQuarter == 4) this.years.push({ "Year": currentYear + i });		
			}
		} else {
			if (currQuarter == 2 || currQuarter == 3) this.years.push({ "Year": currentYear });
		}
        
        console.log("this.years",this.years)



        console.log("this.year",this.year)
        this.year.valueChanges.subscribe(selectedValue => {
            this.filterquarter = [...this.quatersz].filter((ele:any)=> ele.Year == selectedValue);
            this.quater.reset();
        });
        console.log('this.filterquarter: ', this.filterquarter);

        this.currentYear = new Date().getFullYear();
        this.getRiskAssessmentsInfo(this.data);
        this.unitx.setValue({ unit: this.copy.UnitID, name: this.copy.UnitName });
        this.userx.setValue({ user: this.copy.ReviewerGUID, name: this.getUserFullName(this.copy.FirstName, this.copy.MiddleName, this.copy.LastName) });
        this.populateUnitz();
        this.populateUserz();
        // console.log(this.copy)
    }


    quaterDetailsList(): any {
        this.quaterDetailsData
    }

    resetValue(data:any) {
        // this.quarter = data.value
        console.log("edit reset",this.copy)
        this.startDate.reset()
        this.endDate.reset()
        this.remainderDate.reset()
        if (data) {

           for (const quarter of this.filterquarter) {
               if (quarter.Quater === data.value) {
                  this.copy.Quater = quarter.Quater.toString();
                  this.copy.QuaterID = quarter.QuaterID;
                  break;
                }
            }
    }
        this.quaterDetailsData()
    }

    quaterDetailsData(): any {
        if (this.copy.mode === 'add') {
            let dt = new Date()
            // let year = dt.getFullYear()
            if (this.quater.value === 1) {
                return {
                    startQuaterDate: new Date(this.year.value, 0, 1),
                    endQuaterDate: new Date(this.year.value, 3, 0)
                }
            }
            if (this.quater.value === 2) {
                return {
                    startQuaterDate: new Date(this.year.value, 3, 1),
                    endQuaterDate: new Date(this.year.value, 6, 0)
                }
            }
            if (this.quater.value === 3) {
                return {
                    startQuaterDate: new Date(this.year.value, 6, 1),
                    endQuaterDate: new Date(this.year.value, 9, 0)
                }

            }
            if (this.quater.value === 4) {
                return {
                    startQuaterDate: new Date(this.year.value, 9, 1),
                    endQuaterDate: new Date(this.year.value, 12, 0)
                }
            }
        }
        if (this.copy.mode === 'edit') {
            let dt = new Date()
            // let year = dt.getFullYear()

            if (this.quater.value === 1) {
                return {
                    startQuaterDate: new Date(this.year.value, 0, 1),
                    endQuaterDate: new Date(this.year.value, 3, 0)
                }
            }
            if (this.quater.value === 2) {
                return {
                    startQuaterDate: new Date(this.year.value, 3, 1),
                    endQuaterDate: new Date(this.year.value, 6, 0)
                }
            }
            if (this.quater.value === 3) {
                return {
                    startQuaterDate: new Date(this.year.value, 6, 1),
                    endQuaterDate: new Date(this.year.value, 9, 0)
                }

            }
            if (this.quater.value === 4) {
                return {
                    startQuaterDate: new Date(this.year.value, 9, 1),
                    endQuaterDate: new Date(this.year.value, 12, 0)
                }
            }
        }

    }

    changeData() {
        // let dt = new Date()
        // let d = dt.getFullYear()
        // this.years = d
        // return d

        // const currentYear = new Date().getFullYear();
        // return [currentYear, currentYear + 1];
    }

    populateUnitz(): void {
        this.unitz = this.unitx.valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this.filterUnit(name as string) : this.units.slice();
            }),
        );
    }

    populateUserz(): void {
        this.userz = this.userx.valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this.filterUser(name as string) : this.users.slice();
            }),
        );
    }

    displayUnit(unit: Unit): string {
        return unit && unit.name ? unit.name : '';
    }

    displayUser(user: User): string {
        return user && user.name ? user.name : '';
    }

    editUnit(event: any) {
        this.copy.UnitID = null
    }

    changeUnit(event: any) {
        this.reviewerunit = ""
        this.copy.UnitID = event.option.value.unit.toString();
    }

    editUser(event: any) {
        this.copy.ReviewerGUID = null
    }

    changeUser(event: any) {
        this.reviewerunit = ""
        this.copy.ReviewerGUID = event.option.value.user.toString();
    }

    getUserFullName(firstName: any, middleName: any, lastName: any) {
        let name = middleName ? firstName.concat(' ', middleName) : firstName;
        return lastName ? name.concat(' ', lastName) : name;
    }

    private filterUnit(name: string): Unit[] {
        const filterValue = name.toLowerCase();
        return this.units.filter(unit => unit.name.toLowerCase().includes(filterValue));
    }

    private filterUser(name: string): User[] {
        const filterValue = name.toLowerCase();
        return this.users.filter(user => user.name.toLowerCase().includes(filterValue));
    }

    getRiskAssessmentsInfo(data:any): void {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "frameworkData": [
                        {
                            "fwid": "1",
                            "Name": "framworkName value"
                        }
                    ],
                    "userData": [
                        {
                            "userId": "1",
                            "userName": "user Name value"
                        },
                        {
                            "userId": "2",
                            "userName": "user Name value"
                        }, {
                            "userId": "3",
                            "userName": "user Name value"
                        }
                    ],
                    "unitData": [
                        {
                            "unitId": "1",
                            "unitName": "unit name value"
                        },
                        {
                            "unitId": "2",
                            "unitName": "unit name value"
                        },
                        {
                            "unitId": "3",
                            "unitName": "unit name value"
                        }
                    ],
                    "quaterData": [
                        {
                            "QuaterID": "33",
                            "Year": 2023,
                            "Quater": 1
                        },
                        {
                            "QuaterID": "34",
                            "Year": 2023,
                            "Quater": 2
                        }
                    ]
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.process(data);
        } else {
            let data = {
                "CollectionScheduleID": this.data.CollectionScheduleID ? this.data.CollectionScheduleID : null
            };
            this.service.getInfoScheduleRiskAssessment(data).subscribe(res => {
                next:
                this.process(res);
            });
        }
    }




    process(data: any): void {
        if (data.success == 1) {
            if (data.result) {
                if (this.copy.mode == "add") {
                    this.copy.FWID = data.result.frameworkData[0].FWID
                    this.copy.FrameworkName = data.result.frameworkData[0].Name
                }
               
                this.copy.IsReviewerUnit = this.copy.UnitID > 0
                data.result.userData.forEach((user: any) => {
                    this.users.push({ "user": user.userGUID, "name": this.getUserFullName(user.FirstName, user.MiddleName, user.LastName) });
                });
                data.result.unitData.forEach((unit: any) => {
                    this.units.push({ "unit": unit.unitID, "name": unit.unitName });
                });
                data.result.quaterData.filter((ele:any)=> this.currentYear)
                data.result.quaterData.forEach((quat: any) => {
                    this.quatersz.push({
                        "QuaterID": quat.QuaterID, "Year": quat.Year, "Quater": quat.Quater
                    })
                });
                this.filterquarter = [...this.quatersz].filter((ele:any)=> ele.Year == this.year.value);
                if(this.copy.mode == "edit"){
                    const newQuarter = { 
                "QuaterID": this.copy.QuaterID, 
                "Year": this.copy.Year, 
                "Quater": this.copy.Quater 
              };
              console.log('this.filterquarter: ', this.filterquarter);
              
              const isQuarterExists = this.filterquarter.some((q:any) => 
                q.QuaterID === newQuarter.QuaterID
              );
              console.log('isQuarterExists: ', isQuarterExists);

              
              if (!isQuarterExists) {
                this.filterquarter.push(newQuarter);
              }
              console.log(' this.filterquarter: ',  this.filterquarter);
            }
            }
        } else {
            if (data.error.errorCode && data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    validateSave(): void {
        this.reviewerunit = ""
        if (!this.year.value)
            this.reviewerunit = "Select a Year"
        if (this.reviewerunit == "" && !this.quater.value)
            this.reviewerunit = "Select a Quater"
        if (this.reviewerunit == "" && !this.startDate.value)
            this.reviewerunit = "Select a Start Date"
        if (this.reviewerunit == "" && !this.endDate.value)
            this.reviewerunit = "Select a End Date"
        if (this.reviewerunit == "") {
            if (this.copy.IsReviewerUnit) {
                if (this.copy.UnitID) {
                    if (this.copy.UnitID == "")
                        this.reviewerunit = "Select an Unit"
                } else {
                    this.reviewerunit = "Select an Unit"
                }

            } else {
                if (this.copy.ReviewerGUID) {
                    if (this.copy.ReviewerGUID == "")
                        this.reviewerunit = "Select a Reviewer"
                } else {
                    this.reviewerunit = "Select a Reviewer"
                }
            }
        }

        if(this.reviewerunit == '' && !this.remainderDate.value) {
            this.reviewerunit = "Select a Reminder Date"
        }

        if (this.reviewerunit == "")
            this.saveAssessment();
    }

    saveAssessment(): void {
        console.log(this.copy)
        this.copy.StartDate = this.utils.formatTimeZone(this.startDate.value);
        this.copy.EndDate = this.utils.formatTimeZone(this.endDate.value);
        this.copy.RemainderDate = this.utils.formatTimeZone(this.remainderDate.value);
        console.log('this.copy-----',this.copy)
        this.service.setRiskAssessment(this.copy).subscribe(res => {
            next:
            if (res.success == 1) {
                this.dialogRef.close(true);
                this.saveSuccess(this.copy.mode == "add" ? "Risk Assessment has been scheduled." : "Risk Assessment edited successfully.");
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveerror = res.error.errorMessage;
            }
            error: (err: any) =>
            console.log("err::", err);
        });
    }

    saveSuccess(content: string): void {
        const timeout = 3000; // 3 Seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "success",
            data: {
                title: "Success",
                content: content
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                this.router.navigate(['manage-risk-assessments']);
            }, timeout)
        });
    }
}
