export const validate = (values, from = "") => {
  const errors = {};

  if(!values.name) {
    errors.name = "Este campo es obligatorio";
  }else if(values.name.length < 3) {
    errors.name = "El mínimo son 3 caracteres"
  }

  if(from === "subCategory" && !values.categoryId) errors.categoryId = "Este campo es obligatorio";

  return errors;
}
