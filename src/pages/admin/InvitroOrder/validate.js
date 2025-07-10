export const validate = (values, variety) => {
  const errors = {};

  if(!values.varietyId) errors.varietyId = "Este campo es obligatorio";

  if(!values.price) {
    errors.price = "Este campo es obligatorio";
  }else if(isNaN(values.price * 1)) {
    errors.price = "Solo se aceptan números";
  }else if(values.price <= 0) {
    errors.price = "Solo se aceptan valores mayores a 0";
  }else if(values.price <= variety?.minPrice) {
    errors.price = `Debe ser mayor a S/. ${variety?.minPrice}`;
  }

  if(!values.quantity) {
    errors.quantity = "Este campo es obligatorio";
  }else if(isNaN(values.quantity * 1)) {
    errors.quantity = "Solo se aceptan números";
  }else if(values.quantity <= 0) {
    errors.quantity = "Solo se aceptan valores mayores a 0";
  }

  return errors;
}

export const advanceValidate = (values, total, currentAdvance) => {
  const errors = {};

  if(!values.date) errors.date = "Este campo es obligatorio";

  if(!values.amount) {
    errors.amount = "Este campo es obligatorio";
  }else if(isNaN(values.amount * 1)) {
    errors.amount = "Solo se aceptan números";
  }else if(values.amount <= 0) {
    errors.amount = "Solo se aceptan valores mayores a 0";
  }else if(currentAdvance + parseInt(values.amount) > total) {
    errors.amount = "El adelanto es mayor que el total";
  }

  return errors;
}
