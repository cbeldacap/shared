import { Http, BaseRequestOptions, RequestMethod, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { environment } from './../../environments/environment.prod';
import * as db from './db';
import * as _ from 'lodash';

export function backendFactory(backend: MockBackend, options: BaseRequestOptions) {
    backend.connections.subscribe((connection: MockConnection) => {

        // WRAP IN TIMEOUT TO SIMULATE SERVER API CALL
        setTimeout(() => {
            // GET BOOKS
            if (connection.request.url.endsWith('/api/getbooks') && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: db.books })));
            }
        }, 100);
    });

    return new Http(backend, options);
}

export let backendProvider = {
    provide: Http,
    useFactory: backendFactory,
    deps: [MockBackend, BaseRequestOptions]
};