"use client"

import { format } from 'date-fns'
import { getDay } from 'date-fns'
import { parse } from 'date-fns'
import { startOfWeek } from 'date-fns'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CustomEvent, { Event } from './CustomEvent'
import { es } from 'date-fns/locale'

const locales = {
  'es': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})


type Props= {
  events: Event[];
}

export default function CalendarBox({ events }: Props) {
  return (
    <div className="w-full flex-grow bg-white h-[calc(100vh-180px)] p-3 border rounded-md">
      <Calendar
        localizer={localizer}
        events={events}
        components={{
          event: CustomEvent,
        }}
        startAccessor="start"
        endAccessor="end"
        culture='es'
        messages={messages}
        eventPropGetter={customEventPropGetter}
        style={{ height: '100%' }} // Asegurando que el calendario ocupe todo el espacio disponible
      />
    </div>
  )
}

const customEventPropGetter = (event: Event) => {
     
  return {
    style: {
      backgroundColor: "transparent",
      padding: "0px",
    },
  };
};

const messages = {
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  allDay: 'Todo el día',
  event: 'Evento',
  date: 'Fecha',
  time: 'Hora',
  next: 'Siguiente',
  previous: 'Anterior',
  noEventsInRange: 'No hay eventos en este rango',
  showMore: (totalEvents: number) => `Mostrar más (${totalEvents})`,
  tomorrow: 'Mañana',
  yesterday: 'Ayer',
  work_week: 'Semana laboral',          
}