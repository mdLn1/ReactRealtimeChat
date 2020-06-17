module.exports = function (errors) {
  if (!Array.isArray(errors)) errors = [errors];
  return errors;
};
