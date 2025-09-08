function validate(values, action) {
  const errors = {};

  if(action === "register-payment") {
    if(!values.paymentType) errors.paymentType = "Este campo es obligatorio";
  }else if(action === "agency") {
    if(!values.trackingCode) {
      errors.trackingCode = "Este campo es obligatorio";
    }else if(values.trackingCode.length < 3) {
      errors.trackingCode = "Debe tener al menos 3 caracteres";
    }

    if(!values.code) {
      errors.code = "Este campo es obligatorio";
    }else if(values.code.length < 3) {
      errors.code = "Debe tener al menos 3 caracteres";
    }

    if(!values.file) errors.file = "Este campo es obligatorio";
  }else if(action === "delivered-warehouse") {
    if(!values.file) errors.file = "Este campo es obligatorio";
  }

  return errors;
}

export default validate;
