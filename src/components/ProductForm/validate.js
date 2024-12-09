export const validate = (values) => {
  const errors = {};

  if(!values.unit) errors.unit = "Este campo es obligatorio";

  if(!values.name) {
    errors.name = "Este campo es obligatorio";
  }else if(values.name.length < 3) {
    errors.name = "El mínimo son 3 caracteres";
  }

  if(!values.description) {
    errors.description = "Este campo es obligatorio";
  }else if(values.description.length < 10) {
    errors.description = "El mínimo son 10 caracteres";
  }

  if(!values.brand) {
    errors.brand = "Este campo es obligatorio";
  }else if(values.brand.length < 3) {
    errors.brand = "El mínimo son 3 caracteres";
  }

  if(!values.categoryId) errors.categoryId = "Este campo es obligatorio";

  if(!values.brand) {
    errors.brand = "Este campo es obligatorio";
  }else if(values.brand.length < 3) {
    errors.brand = "El mínimo son 3 caracteres";
  }

  if(!values.purchasePrice) {
    errors.purchasePrice = "Este campo es obligatorio";
  }else if(isNaN(values.purchasePrice * 1)) {
    errors.purchasePrice = "Solo se aceptan números";
  }else if(values.purchasePrice <= 0) {
    errors.purchasePrice = "Solo se aceptan valores mayores a 0";
  }

  if(!values.price) {
    errors.price = "Este campo es obligatorio";
  }else if(isNaN(values.price * 1)) {
    errors.price = "Solo se aceptan números";
  }else if(values.price <= 0) {
    errors.price = "Solo se aceptan valores mayores a 0";
  }else if((values.price * 1) <= (values.purchasePrice * 1)) {
    errors.price = "El precio de venta debe ser mayor al precio de compra";
  }

  if(!values.stock) {
    errors.stock = "Este campo es obligatorio";
  }else if(isNaN(values.stock * 1)) {
    errors.stock = "Solo se aceptan números";
  }else if(values.stock <= 0) {
    errors.stock = "Solo se aceptan valores mayores a 0";
  }

  return errors;
}
