module.exports = class HttpError extends Error {
  constructor(message, statusCode = 0) {
    super(message);
    if (statusCode) this.statusCode = statusCode;
  }
};
