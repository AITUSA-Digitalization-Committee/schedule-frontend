import { Schedule } from "@/types";
import { create } from "zustand";

type ScheduleType = {
    schedules: Schedule[];
    setSchedules: (schedules: Schedule[]) => void;
};

export const useSchedule = create<ScheduleType>((set) => ({
    schedules: [],
    setSchedules: (schedules) => set({
        schedules: schedules
    }),
}));