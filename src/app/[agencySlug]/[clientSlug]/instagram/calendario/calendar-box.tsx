"use client"

import { format } from 'date-fns'
import { getDay } from 'date-fns'
import { parse } from 'date-fns'
import { startOfWeek } from 'date-fns'
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CustomEvent, { Event } from './CustomEvent'
import { es } from 'date-fns/locale'
import { useRef, useState } from 'react'
import { ContentSelector } from './content-selector'
import './custom-calendar.css'

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
  agencySlug: string;
  clientSlug: string;
}

export default function CalendarBox({ events, agencySlug, clientSlug }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Capturar los clics en el calendario
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (slotInfo.action === 'click') {
      setSelectedDate(slotInfo.start);
      setShowSelector(true);
    }
  };

  const handleCloseSelector = () => {
    setShowSelector(false);
    setSelectedDate(null);
  };

  return (
    <div ref={calendarRef} className="w-full flex-grow bg-white h-[1000px] p-3 border rounded-md">
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
        selectable={true}
        onSelectSlot={handleSelectSlot}
        className="custom-calendar"
        style={{ height: '100%' }}
      />

      {showSelector && selectedDate && (
        <ContentSelector 
          date={selectedDate}
          agencySlug={agencySlug}
          clientSlug={clientSlug}
          onClose={handleCloseSelector}
        />
      )}
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