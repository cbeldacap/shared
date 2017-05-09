import { Injectable } from '@angular/core';

@Injectable()
export class BusinessOperations {    
    public SERVER_PATH: string = '/api/';
    
    public GET_FIND_ALL: string = this.SERVER_PATH + 'findall';
    public POST_FIND_ONE: string = this.SERVER_PATH + 'findone';
    public POST_SAVE: string = this.SERVER_PATH + 'save';
}