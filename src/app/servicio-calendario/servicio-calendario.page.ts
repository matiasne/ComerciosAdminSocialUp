import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventAddArg, FullCalendarComponent, Calendar, EventInput } from '@fullcalendar/angular'; // useful for typechecking

@Component({
  selector: 'app-servicio-calendario',
  templateUrl: './servicio-calendario.page.html',
  styleUrls: ['./servicio-calendario.page.scss'],
})
export class ServicioCalendarioPage implements OnInit {

  @ViewChild("fullcalendar", { static: true })
  calendarComponent: FullCalendarComponent;
  
  eventsCalendar: any[] = [];
  //used to store initial data
  events: any[] = [];

  calendarApi: Calendar;

  calendarEvents: EventInput[] = [
  ];

  initialized = false;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear'
    },
    initialView: 'timeGridWeek',
    slotDuration: '00:15:00',
    dayHeaderFormat:{ weekday: 'short' },
    dateClick: this.handleDateClick.bind(this), // bind is important!
    events: this.events,
    
  };

  
  constructor() { }

  ngOnInit() {
   

  }

  gotoDate() {
    //the if condition is to prevent possible error
    if (this.calendarApi) {
      this.calendarApi.gotoDate(new Date());
    }
  }

  ionViewDidEnter(){
    this.calendarApi = this.calendarComponent.getApi();
    if (this.calendarApi && !this.initialized) {
      this.initialized = true;
    }
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  agregarTurno(){

    let calendarevent = {
      startEditable: false,
      id:"asd",
      title: "titulo",
      start: new Date().getTime(),
      end:new Date().getTime()+1,
      allDay: true,
    };

    this.calendarEvents =  this.eventsCalendar

    this.eventsCalendar.push(calendarevent);
    this.calendarApi.addEventSource(this.calendarEvents); //obligatory
    
  }

  onEventClick(event){
    console.log(event.param.target)
  }



}
