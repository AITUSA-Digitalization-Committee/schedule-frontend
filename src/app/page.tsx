'use client';

import { ApiResponse, Group } from "@/types";
import { useEffect, useState } from "react";

import MapContainer from "@/components/MapContainer";
import ScheduleItem from "@/components/Schedule";
import View from "@/components/View";
import { api } from "@/api/instance";
import { cn } from "@/util/utils";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";
import { useSchedule } from "@/hooks/schedule";

export default function Home() {

  const { student, loading, setLoading } = useAuth();
  const { schedules, setSchedules } = useSchedule();

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState('');

  const weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [selectedDay, setSelectedDay] = useState(() => {
    const currentDay = new Date();
    return currentDay.getUTCDay()
  });

  const next = () => {
    return selectedDay == 6 ? selectedDay : selectedDay + 1
  }

  const back = () => {
    return selectedDay == 0 ? selectedDay : selectedDay - 1
  }

  // Функция для преобразования времени в объект Date
  const parseTimeToDate = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0); // Устанавливаем часы и минуты, оставляя секунды и миллисекунды равными 0
    return now;
  };

  const sortedSchedules = schedules
    .map((schedule) => {
      return {
        ...schedule,
        startsDate: parseTimeToDate(schedule.starts), // Добавляем новое поле для времени в формате Date
      };
    })
    .sort((a, b) => a.startsDate.getTime() - b.startsDate.getTime()); // Сортируем по времени начала

  // Теперь sortedSchedules содержит расписание, отсортированное по времени начала


  const fetchSchedules = async () => {
    setLoading(true);

    await api.get<ApiResponse<Group>>('/schedule/group/' + student?.group.name)
      .then(({ data }) => {
        if (data.statusCode != 200) {
          toast.error(data.message);
          return;
        }

        setSchedules(data.data.schedules);

        setLoading(false)
      })
  }

  useEffect(() => {
    if (student == null) {
      return;
    }

    fetchSchedules();
  }, [student])

  return (
    <View className="gap-6 py-6 relative overflow-hidden">

      <MapContainer location={location} open={map} setOpen={setMap} />

      {/* Controls */}
      <div className="flex gap-2 px-6">
        <div className={cn("h-10 w-10 bg-muted rounded-full flex items-center justify-center transition-opacity duration-300", selectedDay == 0 ? 'opacity-25' : '')}
          onClick={() => {
            setSelectedDay(back());
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-dark" viewBox="0 -960 960 960"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
        </div>

        <div className="grow bg-primary rounded-2xl text-white flex justify-center items-center font-medium">
          {weeks[selectedDay]}
        </div>

        <div className={cn("h-10 w-10 bg-muted rounded-full flex items-center justify-center transition-opacity duration-300", selectedDay == 6 ? 'opacity-25' : '')}
          onClick={() => {
            setSelectedDay(next());
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-dark" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
        </div>
      </div>

      {/* Schedules */}
      <div
        key={'test'}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${selectedDay * 100}%)` }}
      >
        {weeks.map(week => {

          const weekSchedules = sortedSchedules.filter(s => s.day === week);

          if (!loading && weekSchedules.length == 0) {
            return (
              <div key={week} className="flex min-w-dvw justify-center mt-12 text-muted-dark font-medium text-xl">
                У вас нет пар :)
              </div>
            )
          }

          return (
            <ScheduleItem key={week} loading={loading} setLocation={setLocation} setMap={setMap} sortedSchedules={sortedSchedules} week={week}></ScheduleItem>
          )
        })}
      </div >

    </View >
  );
}
