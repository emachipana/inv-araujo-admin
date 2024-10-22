import { getDoc } from "../../services/getByDocument";

export const onDocChange = async (event, setFieldValue, setError, docType) => {
  const value = event.target.value;
  setFieldValue("document", value);

  if(!isNaN(value * 1)) {
    if(docType === "RUC" && value.length === 11) {
      const info = await getDoc("ruc", value);
      if(info.razonSocial) {
        setFieldValue("rsocial", info.razonSocial);
        setFieldValue("address", info.direccion);          
        return;
      }
      setError(info.message);
    }

    if(docType === "DNI" && value.length === 8) {
      const info = await getDoc("dni", value);
      if(!info.success) return setError(info.message);
      setFieldValue("rsocial", `${info.apellidoPaterno} ${info.apellidoMaterno} ${info.nombres}`);
      setFieldValue("address", "");
    }
  }
}
