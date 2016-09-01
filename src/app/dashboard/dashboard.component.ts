import { Component, OnInit } from '@angular/core';
import { SessionService } from '../shared/session.service';
import { Session } from '../model/session';
import { Observable } from 'rxjs';

@Component({
  selector: 't3dd16-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public sessions$: Observable<Session[]>;

  constructor(protected sessionService: SessionService) { }

  ngOnInit() {
    this.sessions$ = this.sessionService.getUpcommingSessions();
  }

}
