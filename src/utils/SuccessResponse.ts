import { StatusCodes } from "http-status-codes";

class SuccessResponse {

    statusCode: number;
    message: string;
    data: any;

    constructor(statusCode: number, message: string, data: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    static defaultSuccess() {
        return new SuccessResponse(StatusCodes.OK, "Success", "Success");
    }
}

export default SuccessResponse;