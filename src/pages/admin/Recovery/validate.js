export const validate = (values, action) => {
  const errors = {};

  if(action === "sendCode") {
    if(!values.email) {
      errors.email = "Este campo es obligatorio";
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email.trim())) {
      errors.email = "El formato es incorrecto";
    }
  }

  if(action === "validCode") {
    if(!values.code) {
      errors.code = "Este campo es obligatorio";
    }else if(values.code.length < 6) {
      errors.code = "El mínimo son 6 caracteres";
    }

    if(!values.newPassword) {
      errors.newPassword = "Este campo es obligatorio";
    }else if(values.newPassword.length < 6) {
      errors.newPassword = "El mínimo son 6 caracteres";
    }

    if(values.newPassword !== values.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
}
