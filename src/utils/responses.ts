export interface responseInterface {
    status?: string;
    message: string;
    data: any;
}

export function jsonS (res:any, message:string, data:any) {
    res.status(200).json({
        status: "success",
        message: message,
        data: data,
    })
}

export function jsonErr (res:any, message:string, data:any) {
    res.status(400).json({
        status: "error",
        message: message,
        data: data,
    })
}


