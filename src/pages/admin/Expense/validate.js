export const validate = (values) => {
  const errors = {};
 
  if(!values.name) {
    errors.name = "Este campo es obligatorio";
  }else if(values.name.length < 3) {
    errors.name = "El mínimo son 3 caracteres";
  }

  if(!values.price) {
    errors.price = "Este campo es obligatorio";
  }else if(isNaN(values.price * 1)) {
    errors.price = "Solo se aceptan números";
  }else if(values.price <= 0) {
    errors.price = "Solo se aceptan valores mayores a 0";
  }

  if(!values.quantity) {
    errors.quantity = "Este campo es obligatorio";
  }else if(isNaN(values.quantity * 1)) {
    errors.quantity = "Solo se aceptan números";
  }else if(values.quantity <= 0) {
    errors.quantity = "Solo se aceptan valores mayores a 0";
  }

  if(!values.type) errors.type = "Este campo es obligatorio";

  return errors;
}
