export const validate = (values, docType) => {
  const errors = {};

  if(!values.docType) errors.docType = "Este campo es obligatorio";

  if(!values.document) {
    errors.document = "Este campo es obligatorio";
  }else if(isNaN(values.document * 1)) {
    errors.document = "Solo se aceptan números";
  }else if(docType === "RUC" && values.document.length < 11) {
    errors.document = "El mínimo son 11 digitos";
  }else if(docType === "DNI" && values.document.length < 8) {
    errors.document = "El mínimo son 8 digitos";
  }

  if(!values.phone) {
    errors.phone = "Este campo es obligatorio";
  }else if(isNaN(values.phone * 1)) {
    errors.phone = "Solo se aceptan números";
  }
  
  if(!values.firstName) errors.firstName = "Este campo es obligatorio";
  if(!values.department) errors.department = "Este campo es obligatorio";
  if(!values.city) errors.city = "Este campo es obligatorio";
  if(!values.initDate) errors.initDate = "Este campo es obligatorio";

  return errors;
}
