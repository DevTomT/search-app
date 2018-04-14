import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {
  private API_PATH = 'https://cors-anywhere.herokuapp.com/https://rest.bandsintown.com/';
  private API_KEY = '';

  constructor(private http: HttpClient) {}

  getArtistData(searchObject) {
    return this.http.get(`${this.API_PATH}artists/${searchObject.artist}/events?app_id=${this.API_KEY}&date=${searchObject.startDate}%2C${searchObject.endDate}`);
  }
}
