export const validate = (values, from = "") => {
  const errors = {};

  if(!values.name) {
    errors.name = "Este campo es obligatorio";
  }else if(values.name.length < 3) {
    errors.name = "El mínimo son 3 caracteres"
  }

  if(from === "categories") {
    if(!values.description) {
      errors.description = "Este campo es obligatorio";
    }else if(values.description.length < 10) {
      errors.description = "El mínimo son 10 caracteres"
    }

    if(!values.file) errors.file = "Este campo es obligatorio";
  }

  if(from === "subCategory" && !values.categoryId) errors.categoryId = "Este campo es obligatorio";

  return errors;
}
