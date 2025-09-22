export const handleError = (error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log(error.stack);
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details || null,
    });
  }

  // If the error is unexpected (e.g., bug, crash)
  console.error("UNEXPECTED ERROR:", error);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};
