export const handleError = (error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log(error.stack);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export const handleMakeError = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
