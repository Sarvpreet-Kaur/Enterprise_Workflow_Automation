import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      confirmButtonText?: string;
      cancelButtonText?: string;
    }
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

}