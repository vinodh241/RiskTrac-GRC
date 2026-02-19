import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { MatDialog } from '@angular/material/dialog';

const base = environment.bcmapiUrl;
@Injectable({
  providedIn: 'root'
})

export abstract class RestService {
  // @ts-ignore
  wait;

  public previousUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Promise-based queue ensuring only one HTTP request is in-flight at a time.
   * Prevents token refresh race conditions when multiple components trigger
   * API calls concurrently (e.g. dashboard + header notification).
   */
  private static requestQueue: Promise<void> = Promise.resolve();

  constructor(
    protected http: HttpClient,
    protected dialog: MatDialog
  ) { }

  /**
   * Wraps an Observable-returning function so it executes only after all
   * previously enqueued requests have completed. The token is read from
   * localStorage at execution time (not enqueue time), guaranteeing the
   * latest refreshed token is always sent.
   */
  private enqueue<T>(fn: () => Observable<T>): Observable<T> {
    return new Observable<T>(observer => {
      RestService.requestQueue = RestService.requestQueue.then(() => {
        return new Promise<void>((resolve) => {
          fn().subscribe({
            next: (value) => observer.next(value),
            error: (err) => {
              observer.error(err);
              resolve();
            },
            complete: () => {
              observer.complete();
              resolve();
            }
          });
        });
      });
    });
  }

  // Get Data
  protected get(path: string): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    return this.http.get(base + path)
      .pipe(map(res => {
        // console.log(res);
      }));
  }

  protected post(path: string, data: any, wait: boolean = true): Observable<any> {
    return this.enqueue(() => {
      if (wait) {
        if (path.includes('download'))
          this.openWait("Downloading...")
        else
          this.openWait("Fetching Data ...")
      }
      data['token'] = localStorage.getItem('token');
      this.getHTTPHeaders();

      return this.http.post(base + path, data)
        .pipe(map((result: any) => {
          if (wait)
            this.closeWait()
          localStorage.setItem('token', result['token']);
          if (result instanceof Array) {
            return result.pop();
          }
          return result;
        }));
    });
  }

  protected upload(path: string, data: any, remarks: string = "", wait: boolean = true): Observable<any> {
    return this.enqueue(() => {
      const httpHeaders = new HttpHeaders();
      httpHeaders.set('Content-Type', 'multipart/form-data');

      let token = localStorage.getItem('token');
      let formData: FormData;
      if (data === undefined) {
        formData = new FormData();
        formData.delete('token');
        formData.append('UploadFile', '');
      } else {
        data.delete('token');
        formData = data;
      }
      if (token)
        formData.append('token', token);
      if (remarks != "")
        formData.append('remarks', remarks)
      if (wait) {
        this.openWait("Uploading ...");
      }
      return this.http.post<any>(base + path, formData, { headers: httpHeaders })
        .pipe(map((result: any) => {
          if (wait)
            this.closeWait()
          localStorage.setItem('token', result['token']);
          if (result instanceof Array) {
            return result.pop();
          }
          return result;
        }));
    });
  }

  // Update Data
  protected update(path: string, id: number) {
    return this.http.put(base + path, id)
      .pipe(map((result: any) => {
        if (result instanceof Array) {
          return result.pop();
        }
        return result;
      }));
  }

  // Delete Data
  protected delete(path: string, id: number) {
    return this.http.delete(base + path).pipe(map(res => {
      // console.log(res);
    }));
  }

  getHTTPHeaders(): HttpHeaders {
    const result = new HttpHeaders();
    result.set('Content-Type', 'application/json');
    return result;
  }

  getHTTPHeaderss(): HttpHeaders {
    const result = new HttpHeaders();
    result.set('Content-Type', 'multipart/form-data');
    return result;
  }

  openWait(masg: any): void {
    this.wait = this.dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: masg
      }
    })
  }

  closeWait(): void {
    this.wait.close()
  }

  protected post2D(path: string, data: any): Observable<any> {
    return this.enqueue(() => {
      data['token'] = localStorage.getItem("token");
      let httpHeaders = this.getHTTPHeaders();
      return this.http.post(base + path, data, {
        headers: httpHeaders,
        responseType: 'blob' as 'json',
        observe: 'response'
      }).pipe(map((result: any) => {
        localStorage.setItem('token', result.headers.get('token'));
        return result;
      }));
    });
  }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl$.next(previousUrl);
  }
}
