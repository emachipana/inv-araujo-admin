import toast from "react-hot-toast";
import { getDoc } from "../../services/getByDocument";
import { errorParser } from "../../helpers/errorParser";

export const onDocChange = async (event, setFieldValue, docType, setIsDocLoaded) => {
  const value = event.target.value;
  setFieldValue("document", value);
  setFieldValue("rsocial", "");
  setFieldValue("address", "");
  setIsDocLoaded(false);

  try {
    if(!isNaN(value * 1)) {
      if(docType === "RUC" && value.length === 11) {
        const info = await getDoc("ruc", value);
        if(info.razonSocial) {
          setFieldValue("rsocial", info.razonSocial);
          setFieldValue("address", info.direccion);          
          setIsDocLoaded(true);
          return;
        }
  
        toast.error(info.message);
      }
  
      if(docType === "DNI" && value.length === 8) {
        const info = await getDoc("dni", value);
        if(!info.success) return toast.error(info.message);
        setFieldValue("rsocial", `${info.nombres} ${info.apellidoPaterno} ${info.apellidoMaterno}`);
        setFieldValue("address", "");
        setIsDocLoaded(true);
      }
    }
  }catch(e) {
    toast.error(errorParser(e.message));
  }
}
