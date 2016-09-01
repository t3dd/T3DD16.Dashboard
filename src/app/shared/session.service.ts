import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Session } from '../model/session';

@Injectable()
export class SessionService {

  constructor(protected http: Http) {}

  getUpcommingSessions() {
    return Observable
      .interval(100000)
      .startWith(this.fetchSessions())
      .switchMap(() => this.fetchSessions())
      .map(response => response.json())
      .map((sessions: Session[]) => {
        sessions.forEach(session => {
          session.start = new Date(<string>session.start);
          session.end = new Date(<string>session.end);
        });
        return sessions;
      })
      .map((sessions: Session[]) => {
        let now = new Date(), currentTime = now.getTime(), day = now.getDay();

        return sessions.reverse().filter(session => {
          let sessionStart = (<Date>session.start).getTime() - 1800000, sessionEnd = (<Date>session.end).getTime();
          if (
            (<Date>session.start).getDay() === day
            && (session.topics || []).length === 0
            && sessionStart < currentTime
            && sessionEnd > currentTime
          ) {
            return session;
          }
        }).slice(0, 5).reverse();
      });
  }

  protected fetchSessions() {
    return this.http.get(`${environment.endpoint}/sessions.json`);
  }

}
