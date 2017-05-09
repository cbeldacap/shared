import { Book } from './../books/book';
import { Http, BaseRequestOptions, RequestMethod, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { environment } from './../../environments/environment.prod';
import * as db from './db';
import * as _ from 'lodash';

export function backendFactory(backend: MockBackend, options: BaseRequestOptions) {
    backend.connections.subscribe((connection: MockConnection) => {

        // WRAP IN TIMEOUT TO SIMULATE SERVER API CALL
        setTimeout(() => {
            // FIND ALL
            if (connection.request.url.endsWith('/api/findall') && connection.request.method === RequestMethod.Get) {
                connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: db.books })));
            }

            // FIND ONE
            if (connection.request.url.endsWith('/api/findone') && connection.request.method === RequestMethod.Post) {
                let id = connection.request.getBody();
                let bookCopy: Book;
                const originalBook = db.books.find(book => book.id === id);
                if (originalBook) {
                    bookCopy = _.cloneDeep(originalBook);
                }
                if (bookCopy) {
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: bookCopy })));
                } else {
                    connection.mockRespond(new Response(new ResponseOptions({ status: 404, body: {"message": "Book with id: ${id} not found"} })));
                }
            }
            
            // SAVE
            if (connection.request.url.endsWith('/api/save') && connection.request.method === RequestMethod.Post) {
                let savedBook: Book;
                let bookToSave = new Book();
                bookToSave.authors = JSON.parse(connection.request.getBody()).book._authors;
                bookToSave.title = JSON.parse(connection.request.getBody()).book._title;
                if (bookToSave.id) {
                  savedBook = db.books.find(book => book.id === bookToSave.id);
                }
                if (savedBook) {
                  _.assign(savedBook, bookToSave);
                } else {
                  savedBook = Book.from(bookToSave.authors, bookToSave.title);
                  db.books.push(savedBook);
                }

                // FIND ONE
                let bookCopy: Book;
                const originalBook = db.books.find(book => book.id === savedBook.id);
                if (originalBook) {
                    bookCopy = _.cloneDeep(originalBook);
                }
                if (bookCopy) {
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: bookCopy })));
                } else {
                    connection.mockRespond(new Response(new ResponseOptions({ status: 404, body: {"message": "Book with id: ${id} not found"} })));
                }
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