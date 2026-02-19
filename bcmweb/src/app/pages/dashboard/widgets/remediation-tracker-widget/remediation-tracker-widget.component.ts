import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalDashboardService } from 'src/app/services/dashboard/global-dashboard/global-dashboard.service';

@Component({
  selector: 'app-remediation-tracker-widget',
  templateUrl: './remediation-tracker-widget.component.html',
  styleUrls: ['./remediation-tracker-widget.component.scss'],
})
export class RemediationTrackerWidgetComponent {
  @Input() remediationTrackerData :any;
  pieChartID = 'ActionItems';
  barChartID = 'openActionItems';

  RMTListData             : any = [];
  actionItemsPieChartData : any = [];
  openActionitemsByModule : any = [];
  openActionItemsBarChartData: any = [];
  updatedRemediationTrackerStatusList: any = [
    { StatusID: 1, Status: 'Open' },
    { StatusID: 2, Status: 'Closed'},
    { StatusID: 3, Status: 'Delayed'}
  ];

  constructor(
    public authService: AuthService,
    public service: GlobalDashboardService
  ) {}

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.openActionitemsByModule  = this.remediationTrackerData.RMTModuleList;
    this.RMTListData              = this.remediationTrackerData.RMTList;
    (this.RMTListData || []).forEach((data: any) => {
      if ([1, 2, 3, 4, 7].includes(data.ActionItemStatusID)) {
        data['StatusIDOnChart'] = 1;
        data['StatusNameOnChart'] = 'Open';
      }
      if ([6].includes(data.ActionItemStatusID)) {
        data['StatusIDOnChart'] = 2;
        data['StatusNameOnChart'] = 'Closed';
      }
      if ([5].includes(data.ActionItemStatusID)) {
        data['StatusIDOnChart'] = 3;
        data['StatusNameOnChart'] = 'Delayed';
      }
    });
    this.calculateActionItemsCounts();
    this.calculateOpenActionItemByModule();
  }

  calculateActionItemsCounts() {
    this.actionItemsPieChartData = [];


    this.updatedRemediationTrackerStatusList.forEach((status: any) => {
      let count = ((this.RMTListData || []).filter((item: any) => item.StatusIDOnChart == status.StatusID) || []).length;
      let color;
      switch (status.StatusID) {
        case 1:
          color = {
            linearGradient: { x1: 1, x2: 0, y1: 1, y2: 1 },
            stops: [
                [0, '#FCE38A'],
                [1, '#F3B181']
            ]
        };
          break;
        case 2:
          color = {
            linearGradient: { x1: 0, x2: 0, y1: 1, y2: 0 },
            stops: [
              [0, '#2BE760'],
              [1, '#B7FA59']
            ]
        };
          break;
        case 3:
          color = {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, '#F54E4E'],
                [1, '#DEB0B0']
            ]
        };
          break;
      }

      if(this.RMTListData?.length == 0){
        this.actionItemsPieChartData = [];
      }else{
        this.actionItemsPieChartData.push({
          name: status.Status,
          y: count,
          color: color,
        });
      }
    });

  }

  calculateOpenActionItemByModule() {
    this.openActionItemsBarChartData = [];
    let openActionItems = (this.RMTListData || []).filter((item: any) => [1].includes(item.StatusIDOnChart));


    (this.openActionitemsByModule || []).forEach((module: any) => {
      let count = ((openActionItems || []).filter((item: any) => item.BCMModuleID == module.SubModuleID) || []).length;

      this.openActionItemsBarChartData.push({
        name: module.SubModuleName,
        y: count,
        color: {
            linearGradient: { x1: 1, x2: 0, y1: 1, y2: 0 },
            stops: [
                [0, '#F3F3F2'],
                [1, '#B7B8B5']
            ]
        },
        dataLabels: {
          style: {
            fontWeight: 'bold',
            fontSize: '1em',
            textOutline: 'none',
          }
        }
      });
    });

  }
}
