import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
    @Input() unit: any
    @Input() loss: boolean = false

    constructor() { }

    ngOnInit(): void {
    }

    onChangeUnit(): void {
        this.unit.checked = !this.unit.checked
        if(!this.unit.checked)
            this.unit.LossValue = ""
    }
}
