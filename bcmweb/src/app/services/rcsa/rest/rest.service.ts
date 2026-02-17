import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { MatDialog } from '@angular/material/dialog';

const base = environment.ormapiUrl;
@Injectable({
    providedIn: 'root'
})

export abstract class RestService {
    // @ts-ignore
    wait;

    constructor(
        private http: HttpClient,
        private _dialog: MatDialog
    ) { }
    // private responseClass:ResponseClass

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

    protected post(path: string, data: any, wait:boolean = true): Observable<any> {
        if(wait)
            this.openWait()
        data['token'] = localStorage.getItem('token');
        this.getHTTPHeaders();

        return this.http.post(base + path, data)
            .pipe(map((result: any) => {
                if(wait)
                    this.closeWait()
                //this.messageService.sendMessage(path, result['success'], result['token'], result['error'].errorMessage, result['message'])
                localStorage.setItem('token', result['token']);
                if (result instanceof Array) {
                    return result.pop();
                }
                return result;
            }));
    }

    protected upload(path: string, data: any): Observable<any> {
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
            // formData.append('PolicyName', token);
        return this.http.post<any>(base + path, formData, { headers: httpHeaders })
            .pipe(map((result: any) => {
                localStorage.setItem('token', result['token']);
                if (result instanceof Array) {
                    return result.pop();
                }
                return result;
            }));
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

    openWait(): void {
        this.wait = this._dialog.open(WaitComponent, {
            id: "WaitComponent",
            disableClose: true,
            panelClass: "dark",
            data: {
                text: "Fetching Data ..."
            }
        })
    }

    closeWait(): void {
        this.wait.close()
    }

}
