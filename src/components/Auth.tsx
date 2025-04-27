'use client'

import { useAuth } from "@/hooks/auth";
import { ApiResponse, Student } from "@/types";
import { ReactNode, useEffect } from "react";
import xior from "xior";
import Loading from "./Loading";
import { toast } from "react-toastify";

interface AuthProps {
    children?: ReactNode,
}

function Auth({ children }: AuthProps) {
    const { setStudent } = useAuth();
    const { token, setToken } = useAuth();
    const { loading, setLoading } = useAuth();

    { /* Получаем token */ }
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {

            if (event.data.type === "INIT") {
                console.log("Received token:", event.data.data)
                setToken(event.data.data);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    { /* Получаем студента */ }
    const fetchStudent = async () => {

        if (!token) {
            return;
        }

        await xior.get<ApiResponse<Student>>('https://api.yeunikey.dev/v1/auth/profile', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {

            if (response.data.statusCode == 400) {
                return;
            }
            setStudent(response.data.data);
            setLoading(false);
        }).then(() => {
            toast.error('Не удалось пройти авторизацию!');
        })
    }

    useEffect(() => {
        fetchStudent();
    }, [token])

    return (
        <>
            {loading && (
                <div className="bg-white">
                    <Loading className="fixed w-full h-dvh"></Loading>
                </div>
            )}
            {children}
        </>
    );
}

export default Auth;