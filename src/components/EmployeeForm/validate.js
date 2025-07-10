export const validate = (values) => {
  const errors = {};

  if(!values.rsocial) errors.rsocial = "Este campo es obligatorio";

  if(!values.email) {
    errors.email = "Este campo es obligatorio";
  } else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email.trim())) {
    errors.email = "El formato es incorrecto";
  }

  if(!values.document) {
    errors.document = "Este campo es obligatorio";
  } else if(values.document.length !== 8) {
    errors.document = "Solo se aceptan 8 dígitos";
  }else if(isNaN(values.document * 1)) {
    errors.document = "Solo se aceptan números";
  }

  if(!values.phone) {
    errors.phone = "Este campo es obligatorio";
  }else if(isNaN(values.phone * 1)) {
    errors.phone = "Solo se aceptan números";
  }

  if(!values.roleId) errors.roleId = "Este campo es obligatorio";

  return errors;
}
