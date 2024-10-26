export const validate = (values) => {
  const errors = {};

  if(!values.newPassword) {
    errors.newPassword = "Este campo es obligatorio";
  }else if(values.newPassword.length < 6) {
    errors.newPassword = "El mínimo son 6 caracteres";
  }

  if(values.newPassword !== values.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";

  return errors;
}
