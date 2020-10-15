import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventAddArg, FullCalendarComponent, Calendar, EventInput } from '@fullcalendar/angular'; // useful for typechecking
import { Comercio } from '../Models/comercio';
import { ComerciosService } from '../Services/comercios.service';
import { HorariosService } from '../Services/horarios.service';
import { Horario } from '../models/horario';

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

  public horarios = [];
  
  constructor(
    private comerciosService:ComerciosService
  ) { }

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

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercio_seleccionadoId)
    this.comerciosService.get(comercio_seleccionadoId).subscribe(snapshot =>{
      let com:any = snapshot.payload.data();     
      com.horarios.forEach((item: any) => {  
        this.horarios.push(item);    
        console.log(item);    
      });
      console.log(this.horarios);  
      this.agregarFranjasAbierto();
    });

    
  }

  agregarFranjasAbierto(){

    console.log(this.calendarApi.view.currentStart.getTime()+" "+this.calendarApi.view.currentEnd.getTime());

    for (let loop = this.calendarApi.view.currentStart.getTime();
      loop <= this.calendarApi.view.currentEnd.getTime();
      loop = loop + (24 * 60 * 60 * 1000)) {
      var test_date = new Date(loop);

      this.horarios.forEach(horario =>{
        if (test_date.getDay() == horario.dia) {
          // we're in Moday, create the event
          let calendarevent = {
            startEditable: true,
            id:"asd",
            title: "titulo",
            start: horario.desde,
            end: horario.hasta,
            editable: true,
            display: 'background'
          };
      
          this.calendarEvents =  this.eventsCalendar;
          this.eventsCalendar.push(calendarevent);
          this.calendarApi.addEventSource(this.calendarEvents);
        }
      })    
    }
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)    
  }

  agregarEspacios(){

    
  }

  onEventClick(event){
    console.log(event.param.target)
  }



}
