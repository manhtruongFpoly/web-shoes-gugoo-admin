import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constant } from '../../_constant/Constant';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  message = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog?: any,

  ) { }

  ngOnInit() {
    this.message = this.dataDialog.message;
  }

  onDismiss(): void {
    this.dialogRef.close(Constant.RESULT_CLOSE_DIALOG.CLOSE);
  }

  onConfirm(): void {
      this.dialogRef.close(Constant.RESULT_CLOSE_DIALOG.CONFIRM);
  }

}
