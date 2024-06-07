"use client"

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

const myEventsList = [
  {
    title: 'Reunión de Proyecto',
    start: new Date(2024, 5, 10, 10, 0), // 10 de junio de 2024, 10:00 AM
    end: new Date(2024, 5, 10, 11, 0), // 10 de junio de 2024, 11:00 AM
    href: 'https://www.google.com',
    image: 'https://res.cloudinary.com/dtm41dmrz/image/upload/c_fill,w_800/v1/tinta-posts/r8ptqegbwok31nqnasa6.jpg?_a=DAJAUVWIZAA0',
    color: '#FDEBD0',
    fechaImportante: "hola",
    status: "PENDING",
  },
  {
    title: 'Presentación de Resultados',
    start: new Date(2024, 5, 15, 14, 0), // 15 de junio de 2024, 2:00 PM
    end: new Date(2024, 5, 15, 15, 0), // 15 de junio de 2024, 3:00 PM
  },
  {
    title: 'Revisión Mensual',
    start: new Date(2024, 5, 25, 9, 0), // 25 de junio de 2024, 9:00 AM
    end: new Date(2024, 5, 25, 10, 0), // 25 de junio de 2024, 10:00 AM
  },
]

export default function CalendarBox() {
  return (
    <div className="w-full flex-grow bg-white min-h-[500px] p-3 border rounded-md">
      <Calendar
        localizer={localizer}
        events={myEventsList}
        // components={{
        //   event: CustomEvent,
        // }}
        startAccessor="start"
        endAccessor="end"
        culture='es'
        // style={{ height: 800 }}
        messages={{
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
          showMore: totalEvents => `Mostrar más (${totalEvents})`,
          tomorrow: 'Mañana',
          yesterday: 'Ayer',
          work_week: 'Semana laboral',          
        }}
      />
    </div>
  )
}

