import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  @Input() name: string;

  constructor(
    public ref: NbDialogRef<ConfirmComponent>
  ) { }

  ngOnInit(): void {}

}
