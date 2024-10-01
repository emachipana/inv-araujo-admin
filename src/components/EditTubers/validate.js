export const validate = (values) => {
  const errors = {};

  if(!values.tuberId) errors.tuberId = "Este campo es obligatorio";

  if(!values.price) {
    errors.price = "Este campo es obligatorio";
  }else if(isNaN(values.price * 1)) {
    errors.price = "Solo se aceptan números";
  }else if(values.price <= 0) {
    errors.price = "Solo se aceptan valores mayores a 0";
  }else if(values.price <= values.minPrice) {
    errors.price = "El precio tiene que ser mayor";
  }

  if(!values.minPrice) {
    errors.minPrice = "Este campo es obligatorio";
  }else if(isNaN(values.minPrice * 1)) {
    errors.minPrice = "Solo se aceptan números";
  }else if(values.minPrice <= 0) {
    errors.minPrice = "Solo se aceptan valores mayores a 0";
  }

  if(!values.name) {
    errors.name = "Este campo es obligatorio";
  }else if(values.name.length < 3) {
    errors.name = "El mínimo son 3 caractares";
  }

  return errors;
}
