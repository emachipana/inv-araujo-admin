export const validate = (values, docType, invoiceType) => {
  const errors = {};

  if(!values.invoicePreference) errors.invoicePreference = "Este campo es obligatorio";
  if(!values.documentType) errors.documentType = "Este campo es obligatorio";
  if(!values.rsocial) errors.rsocial = "Este campo es obligatorio";

  if(!values.document) {
    errors.document = "Este campo es obligatorio";
  }else if(isNaN(values.document * 1)) {
    errors.document = "Solo se aceptan números";
  }else if(docType === "RUC" && values.document.length < 11) {
    errors.document = "El mínimo son 11 digitos";
  }else if(docType === "DNI" && values.document.length < 8) {
    errors.document = "El mínimo son 8 digitos";
  }

  if(invoiceType === "FACTURA" && !values.address) errors.address = "Este campo es obligatorio";
  
  return errors;

}
