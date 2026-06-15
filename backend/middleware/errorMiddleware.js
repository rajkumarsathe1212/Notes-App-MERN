
import { sendError } from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  sendError(
    res,
    statusCode,
    err.message || "Internal Server Error"
  );
};

export default errorHandler;
