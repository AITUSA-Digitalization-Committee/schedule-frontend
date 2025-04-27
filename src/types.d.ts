interface ApiResponse<T> {
    statusCode: number,
    message?: string,
    data: T
}

interface Student {
    token: string,

    barcode: number,
    name: string,
    surname: string,

    group: {
        name: string
    }
}

interface Group {
    id: number,
    name: string,
    schedules: Schedule[]
}

interface Schedule {
    id: number,
    day: string;
    starts: string;
    ends: string;
    subject: string;
    classroom: string;
    type: string;
    lecturer: string;
}

export {
    ApiResponse,
    Student,
    Group,
    Schedule
}