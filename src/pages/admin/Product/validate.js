export const validate = (values, currentPrice) => {
  const errors = {};

  if(!values.price) {
    errors.price = "Este campo es obligatorio";
  }else if(isNaN(values.price * 1)) {
    errors.price = "Solo se aceptan números";
  }else if(values.price <= 0) {
    errors.price = "Solo se aceptan valores mayores a 0";
  }else if(values.price >= currentPrice) {
    errors.price = `El precio de descuento debe ser menor a S/. ${currentPrice}`;
  }

  return errors;
}