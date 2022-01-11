import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-notification',
  templateUrl: './confirm-notification.component.html',
  styleUrls: ['./confirm-notification.component.scss']
})
export class ConfirmNotificationComponent implements OnInit {

  constructor(
    public ref: NbDialogRef<ConfirmNotificationComponent>
  ) { }

  ngOnInit(): void { }

}
