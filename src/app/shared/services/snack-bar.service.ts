import { inject, Injectable, signal } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private _snackBar = inject(MatSnackBar);

  message = signal('');
  durationInMiliSeconds = 3000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  showSnackBar(
    message: string,
    duration = 300,
    horizontalPosition: MatSnackBarHorizontalPosition,
    verticalPosition: MatSnackBarVerticalPosition
  ): void {
    this.message.set(message);
    this.durationInMiliSeconds = duration;
    this.horizontalPosition = horizontalPosition;
    this.verticalPosition = verticalPosition;

    this._openSnackBar();
  }

  private _openSnackBar(): void {
    this._snackBar.open(this.message(), 'Close', {
      duration: this.durationInMiliSeconds,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
