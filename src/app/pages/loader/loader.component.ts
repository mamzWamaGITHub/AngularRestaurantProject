import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
        this.isLoading = val;
    });
}
}
