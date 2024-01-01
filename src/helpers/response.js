const response = (response = {}) => {
    const responseObject = {
        "status": response.status,
        "statusCode": response.statusCode,
        "message": response.message,
        "data": {},
        "errors":[]
    };

    if (response.type) {
        responseObject.data.type = response.type;
    }

    if (response.data) {
        responseObject.data.attributes = response.data;
    }

    if (response.token) {
        responseObject.data.token = response.token;
    }

    if (response.errors) {
        responseObject.errors = response.errors;
    }

    return responseObject;
}

module.exports = response;
