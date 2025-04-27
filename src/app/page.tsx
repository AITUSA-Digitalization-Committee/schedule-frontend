'use client'

import { api } from "@/api/instance";
import MapContainer from "@/components/MapContainer";
import View from "@/components/View";
import { useAuth } from "@/hooks/auth";
import { useSchedule } from "@/hooks/schedule";
import { ApiResponse, Group } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {

  const { student, loading, setLoading } = useAuth();
  const { schedules, setSchedules } = useSchedule();

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState('');

  const weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState(0);

  const fetchSchedules = async () => {
    setLoading(true);

    await api.get<ApiResponse<Group>>('/schedule/group/' + student?.group)
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

  const containerVariants = {
    show: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <View className="gap-6 py-6 relative overflow-hidden">

      <MapContainer location={location} open={map} setOpen={setMap} />

      {/* Controls */}
      <div className="flex gap-2 px-6">
        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center"
          onClick={() => {
            setSelectedDay(selectedDay == 0 ? selectedDay : selectedDay - 1);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-dark" viewBox="0 -960 960 960"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
        </div>

        <div className="grow bg-primary rounded-2xl text-white flex justify-center items-center font-medium">
          {weeks[selectedDay]}
        </div>

        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center"
          onClick={() => {
            setSelectedDay(selectedDay == 6 ? selectedDay : selectedDay + 1);
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

          const weekSchedules = schedules.filter(s => s.day == week);

          if (!loading && weekSchedules.length == 0) {
            return (
              <div key={week} className="flex min-w-dvw justify-center mt-12 text-muted-dark font-medium text-xl">
                У вас нет пар :)
              </div>
            )
          }

          return (
            <AnimatePresence mode="wait" key={week}>

              <motion.div
                className="flex flex-col gap-2 min-w-dvw"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {weekSchedules.map((schedule) => {

                    const starts = schedule.starts.split(':');
                    const ends = schedule.ends.split(':');

                    const time = starts[0] + ':' + starts[1] + " - " + ends[0] + ':' + ends[1];

                    return (
                      <motion.div
                        key={schedule.id}
                        className="bg-muted p-3 rounded-2xl mx-6"
                        variants={itemVariants}
                      >
                        <div className="text-lg font-semibold">
                          {schedule.subject}
                        </div>
                        <div className="text-dark-light-gray text-sm">
                          {schedule.lecturer}
                        </div>

                        <div className="mt-3 flex justify-between">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-dark-light-gray" height={'16px'} width={'16px'} viewBox="0 -960 960 960"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" /></svg>
                            <div className="text-dark-light-gray font-medium text-sm -mb-[1px]">
                              {time}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-dark-light-gray" height={'16px'} width={'16px'} viewBox="0 -960 960 960"><path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Zm-160 65v-396q-33-14-68.5-21.5T260-720q-37 0-72 7t-68 21v397q35-13 69.5-19t70.5-6q36 0 70.5 6t69.5 19Zm0 0v-396 396Z" /></svg>
                            <div className="text-dark-light-gray font-medium text-sm">
                              {schedule.type}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between"
                          onClick={() => {
                            setLocation(schedule.classroom);
                            setMap(true);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-dark-light-gray" height={'16px'} width={'16px'} viewBox="0 -960 960 960"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" /></svg>
                            <div className="text-dark-light-gray font-medium text-sm">
                              {schedule.classroom}
                            </div>
                          </div>
                          <div className="text-sm bg-primary px-4 rounded-full text-white font-medium">
                            Карта
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          )
        })}
      </div >

    </View >
  );
}