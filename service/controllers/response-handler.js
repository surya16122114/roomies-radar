// export const setSuccess = (data, response) => {
//     response.status(200);
//     response.json(data);
// };

// export const setError = (error, response) => {
//     response.status(500);
//     response.json({
//         code: "ServerError",
//         message: error.message,
//     });
// };

export const setSuccess = (data, response, statusCode = 200) => {
    response.status(statusCode).json({
        success: true,
        data: data,
    });
};

export const setError = (error, response) => {
    console.error("Error occurred:", error); // Logs the error for debugging

    const statusCode = error.statusCode || 500; // Use error's status code if available
    const errorCode = error.name || "ServerError"; // Use error's name if available

    response.status(statusCode).json({
        success: false,
        code: errorCode,
        message: error.message || "An unexpected error occurred.",
    });
};
