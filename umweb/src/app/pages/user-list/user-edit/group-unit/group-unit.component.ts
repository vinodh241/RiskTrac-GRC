import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
    selector: 'app-group-unit',
    templateUrl: './group-unit.component.html',
    styleUrls: ['./group-unit.component.scss']
})
export class GroupUnitComponent implements OnInit {
    // @ts-ignore
    @Input() source: string;
    // @ts-ignore
    @Input() groups: string;
    // @ts-ignore
    @Input() units: string;

    dtSource: any;
    dtGroups: any;
    dtUnits: any;
    dcUnits: string[] = ['group', 'unit', 'action'];

    selectedGroup: any;

    constructor() { }

    ngOnInit(): void {
        console.log("this.groups", this.groups);
        if(this.source)
            this.dtSource = JSON.parse(this.source);
        this.dtGroups = JSON.parse(this.groups);
        this.dtUnits = JSON.parse(this.units);
        console.log("dtGroups", this.dtGroups);
    }

    deleteUnit(row: any): void {
        let idx = this.dtSource.Units.indexOf(row);
        this.dtSource.Units.splice(idx, 1);
        this.dtSource.Units = [...this.dtSource.Units];
    }

    filteredUnits(groupId: any) {
        return this.dtUnits.filter((unit: any) => unit.GroupID === groupId);
    }

    assignUnit(): void {
        this.dtSource.Units.push({"UnitID":-1}); 
        this.dtSource.Units = [...this.dtSource.Units];
    }
}
