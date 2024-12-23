export const validate = (values, docType, action) => {
  const errors = {};

  if(action === "Nuevo cliente") {
    if(!values.documentType) errors.documentType = "Este campo es obligatorio";
    
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

    if(!values.rsocial) errors.rsocial = "Este campo es obligatorio";
  
    if(values.email) {
      if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email.trim())) errors.email = "El formato es incorrecto";
    }
  }
  
  if(!values.department) errors.department = "Este campo es obligatorio";
  if(!values.city) errors.city = "Este campo es obligatorio";
  if(!values.initDate) errors.initDate = "Este campo es obligatorio";

  return errors;
}
