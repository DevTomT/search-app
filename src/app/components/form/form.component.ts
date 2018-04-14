import { MaterializeDirective, MaterializeAction } from 'angular2-materialize';
import { Component, OnInit, EventEmitter, OnChanges } from '@angular/core';
import { AppService } from './../../shared/app.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [ AppService ]
})
export class FormComponent implements OnInit {

  // Events array (response from API)
  events;

  // Errors array (response form API)
  errorResponses;

  // Form data
  artist: string;
  startDate: string;
  endDate: string;

  // Request object
  searchObj;

  // Helpers
  busy: boolean;
  defaultErr: string;
  emptyFieldInfo: string;
  zeroResultsInfo: string;
  invalidArtistInfo: string;
  invalidArtistInfo2: string;
  pickerVisible: boolean;

  // Datepickers options
  startDatepickerOptions;
  endDatepickerOptions;


  constructor(private appService: AppService) {}


  ngOnInit() {
    this.busy = false;
    const self = this;

    this.events = [];
    this.pickerVisible = true;

    // Artist input autocomplete
    $(document).ready(function() {
      (<any>$('input.autocomplete')).autocomplete({
        data: {
          'Deep Purple': null,
          'Rihanna': null,
          'Taylor Swift': null,
          'Katy Perry': null,
          'Maroon 5': null,
          'Justin Bieber': null,
          'Lady Gaga': null,
          'Bruno Mars': null,
          'Ed Sheeran': null,
          'Metalica': null,
          'Iron Maiden': null,
          'Lenny Kravitz': null
        },
        onAutocomplete: function (val) {
          self.artist = val;
        }
      });
    });

    this.startDatepickerOptions = {
      format: 'yyyy-mm-dd',
      today: false,
      clear: 'clear',
      onClose: () => this.bindMinDate()
    };

    this.endDatepickerOptions = {
      format: 'yyyy-mm-dd',
      today: false,
      clear: 'clear'
    };

  }


  private showEvents() {
    this.searchObj = {artist: this.artist, startDate: this.startDate, endDate: this.endDate};

    if (!this.isArtistValid()) {
      this.invalidArtistInfo = 'Invalid Artist name';
      this.invalidArtistInfo2 = 'You can use letters, nubers, one space between words and signs "-", "&"';
      return;
    }
    this.setEndDate();
    this.resetVariables();
    if (!this.isFormValid()) {
      return;
    }

    this.busy = true;
    this.appService.getArtistData(this.searchObj).subscribe(
      data => {
        this.events = data;

        if (this.events.length === 0) {
          this.zeroResultsInfo = 'No results found for your search :(';
        }

        this.busy = false;
      },
      err => {
        if (err.status === 403) {
          this.errorResponses = err.error.errors;
        } else {
          this.defaultErr = 'Something went wrong. Please try again :(';
        }

        this.events = [];
        this.busy = false;
      }
    );
  }


  // Because I don't found more elegant way to pass 'minDate' to endDatapicker dynamically (it must depend on startDatepicker choosen date)
  // I decided to reinitialize endDatepicker on startDatepicker close.
  private bindMinDate() {
    const self = this;
    this.pickerVisible = false;

    setTimeout(() => { this.pickerVisible = true; }, 0);

    this.endDatepickerOptions = {
      format: 'yyyy-mm-dd',
      today: false,
      clear: 'clear',
      min: new Date(self.startDate)
    };
  }


  private resetVariables () {
    this.emptyFieldInfo = null;
    this.zeroResultsInfo = null;
    this.defaultErr = null;
    this.invalidArtistInfo = null;
    this.invalidArtistInfo2 = null;
    this.errorResponses = [];
  }


  private isFormValid() {
    let isFieldEmpty = false;

    Object.values(this.searchObj).forEach(value => {
      if (!value) {
        isFieldEmpty = true;
      }
    });

    if (isFieldEmpty) {
      this.emptyFieldInfo = 'Please fill all fields';
      return false;
    }

    return true;
  }


  private setEndDate() {
    if (new Date(this.startDate) > new Date(this.endDate)) {
      this.endDate = this.startDate;
    }
  }


  isArtistValid() {
    this.artist = this.artist.trim();
    const pattern = /^([a-z0-9-&]+\s?)+$/i;
    return pattern.test(this.artist);
  }
}
