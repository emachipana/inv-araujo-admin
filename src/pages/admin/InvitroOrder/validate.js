export const validate = (values, variety) => {
  const errors = {};

  if(!values.varietyId) errors.varietyId = "Este campo es obligatorio";

  if(!values.price) {
    errors.price = "Este campo es obligatorio";
  }else if(isNaN(values.price * 1)) {
    errors.price = "Solo se aceptan números";
  }else if(values.price <= 0) {
    errors.price = "Solo se aceptan valores mayores a 0";
  }else if(values.price <= variety?.minPrice) {
    errors.price = `Debe ser mayor a S/. ${variety?.minPrice}`;
  }

  if(!values.quantity) {
    errors.quantity = "Este campo es obligatorio";
  }else if(isNaN(values.quantity * 1)) {
    errors.quantity = "Solo se aceptan números";
  }else if(values.quantity <= 0) {
    errors.quantity = "Solo se aceptan valores mayores a 0";
  }

  return errors;
}

export const advanceValidate = (values) => {
  const errors = {};

  if(values.paymentType === "") errors.paymentType = "Este campo es obligatorio";

  return errors;
}

export const orderStateValidate = (values, action, shippingType) => {
  const errors = {};

  if(action === "select-shipping") {
    if(!values.shippingType) errors.shippingType = "Este campo es obligatorio";

    if(shippingType === "ENVIO_AGENCIA") {
      if(!values.department) {
        errors.department = "Este campo es obligatorio";
      }else if(values.department.length < 3) {
        errors.department = "El mínimo son 3 caracteres";
      }

      if(!values.city) {
        errors.city = "Este campo es obligatorio";
      }else if(values.city.length < 3) {
        errors.city = "El mínimo son 3 caracteres";
      }

      if(!values.fullName) {
        errors.fullName = "Este campo es obligatorio";
      }else if(values.fullName.length < 3) {
        errors.fullName = "El mínimo son 3 caracteres";
      }

      if(!values.document) {
        errors.document = "Este campo es obligatorio";
      }else if(values.document.length < 8) {
        errors.document = "El mínimo son 8 caracteres";
      }

      if(!values.phone) {
        errors.phone = "Este campo es obligatorio";
      }else if(values.phone.length < 9) {
        errors.phone = "El mínimo son 9 caracteres";
      }
    }

    if(shippingType === "RECOJO_ALMACEN") {
      if(!values.date) {
        errors.date = "Este campo es obligatorio";
      }

      if(!values.hour) {
        errors.hour = "Este campo es obligatorio";
      }
    }
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
