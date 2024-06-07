import CalendarRC from "./CalendarRC";
import CalendarBox from "./calendar-box";

const myEventsList = [
  {
    title: 'Reunión de Proyecto',
    content: 'contenido',
    start: new Date(2024, 5, 10, 10, 0), // 10 de junio de 2024, 10:00 AM
    end: new Date(2024, 5, 10, 11, 0), // 10 de junio de 2024, 11:00 AM
    image: 'https://res.cloudinary.com/dtm41dmrz/image/upload/c_fill,w_800/v1/tinta-posts/r8ptqegbwok31nqnasa6.jpg?_a=DAJAUVWIZAA0',
    color: '#FDEBD0',
    href: `#` ,
    fechaImportante: "hola",
    status: "PENDING",
  }
]
export default async function CalendarPage() {
  return (
    <div className="w-full mt-2 flex flex-col h-full p-3 bg-gray-200 border border-gray-300 rounded-xl">
      <CalendarRC events={myEventsList}></CalendarRC>
        {/* <CalendarBox /> */}
      </div>
  )
}

