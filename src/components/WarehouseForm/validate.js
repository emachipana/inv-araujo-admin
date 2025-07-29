export const validate = (values) => {
  const errors = {};

  if(!values.name) {
    errors.name = "El nombre es obligatorio";
  }else if(values.name.length < 3) {
    errors.name = "El mínimo son 3 caracteres";
  }

  if(!values.ref) {
    errors.ref = "La referencia es obligatoria";
  }else if(values.ref.length < 3) {
    errors.ref = "El mínimo son 3 caracteres";
  }

  if(!values.address) errors.address = "La dirección es obligatoria";

  if(!values.province) errors.province = "La provincia es obligatoria";

  if(!values.district) errors.district = "El distrito es obligatorio";

  if(!values.department) errors.department = "El departamento es obligatorio";

  if(!values.latitude) errors.latitude = "La latitud es obligatoria";

  if(!values.longitude) errors.longitude = "La longitud es obligatoria";

  return errors;
}
