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
        let now = new Date(), start = now.getTime() - 1350000, end = now.getTime(), day = now.getDay();

        return sessions.reverse().filter(session => {
          if (
            (<Date>session.start).getDay() === day
            && (<Date>session.start).getTime() > start
            && (<Date>session.end).getTime() > end
            && (session.topics || []).length === 0) {
            return session;
          }
        }).slice(0, 5).reverse();
      });
  }

  protected fetchSessions() {
    return this.http.get(`${environment.endpoint}/sessions.json`);
  }

}
