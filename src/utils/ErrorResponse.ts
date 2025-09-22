import { StatusCodes } from "http-status-codes";

class ErrorResponse {

    statusCode: number;
    message: string;
    data: any;

    constructor(statusCode: number, message: string, data: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    static defaultSuccess() {
        return new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", "Please Try Again Later!");
    }
}

export default ErrorResponse;