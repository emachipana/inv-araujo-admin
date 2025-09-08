export const validate = (values) => {
  const errors = {};

  if(!values.name) {
    errors.name = "Este campo es obligatorio";
  }else if(values.name.length < 3) {
    errors.name = "El mínimo son 3 caracteres"
  }

  return errors;
}
