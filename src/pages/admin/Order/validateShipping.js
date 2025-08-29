export const validateShipping = (values, shipType) => {
  const errors = {};

  if(shipType === "ENVIO_AGENCIA") {
    if(!values.fullName) {
      errors.fullName = "Este campo es obligatorio";
    }else if(values.fullName.length < 3) {
      errors.fullName = "Debe tener al menos 3 caracteres";
    }

    if(!values.document) {
      errors.document = "Este campo es obligatorio";
    }else if(isNaN(values.document * 1)) {
      errors.document = "Solo se aceptan números";
    }else if(values.document.length < 8) {
      errors.document = "Debe tener al menos 8 caracteres";
    }

    if(!values.phone) {
      errors.phone = "Este campo es obligatorio";
    }else if(isNaN(values.phone * 1)) {
      errors.phone = "Solo se aceptan números";
    }else if(values.phone.length < 9) {
      errors.phone = "Debe tener al menos 9 caracteres";
    }

    if(!values.city) errors.city = "Este campo es obligatorio";
    if(!values.department) errors.department = "Este campo es obligatorio";
  }else if(shipType === "RECOJO_ALMACEN") {
    if(!values.date) errors.date = "Este campo es obligatorio";
    if(!values.hour) errors.hour = "Este campo es obligatorio";
  }

  return errors;
}
