import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SprinnerService } from 'src/app/_service/sprinner-service/sprinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnDestroy {

  $unsubscribe: Subscription;
  isLoading: boolean = false;

  constructor(
      private loadingService: SprinnerService,
      private cdr: ChangeDetectorRef,
  ){}

  ngOnInit(): void {
      this.$unsubscribe = this.loadingService.$loading.subscribe(isLoading => {
          this.isLoading = isLoading;
          this.cdr.detectChanges();
      })
  }

  ngOnDestroy(): void {
      if (this.$unsubscribe) {
          this.$unsubscribe.unsubscribe();
      }
  }

}
