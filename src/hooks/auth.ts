import { Student } from "@/types";
import { create } from "zustand";

type StudentType = {
    student: Student | null;
    token: string;
    loading: boolean;

    setStudent: (student: Student | null) => void;
    setLoading: (loading: boolean) => void;
    setToken: (string: string) => void;

};

export const useAuth = create<StudentType>((set) => ({
    student: null,
    token: "",
    loading: true,

    setStudent: (student) => set({
        student: student
    }),
    setLoading: (loading) => set({
        loading: loading
    }),
    setToken: (token) => set({
        token: token
    }),
}));