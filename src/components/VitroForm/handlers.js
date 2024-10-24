import apiFetch from "../../services/apiFetch";
import { getDoc } from "../../services/getByDocument";

export const onDocTypeChange = (event, setFieldValue, setDocType, fieldDoc) => {
  const value = event.target.value;
  setFieldValue(fieldDoc, value);
  setDocType((value * 1) === 1 ? "DNI" : "RUC");
}

export const onDocChange = async (event, setFieldValue, setError, docType) => {
  const value = event.target.value;
  setFieldValue("document", value);

  if(!isNaN(value * 1)) {
    if(docType === "RUC" && value.length === 11) {
      const info = await getDoc("ruc", value);
      if(info.razonSocial) return setFieldValue("rsocial", info.razonSocial);
      setError(info.message);
    }

    if(docType === "DNI" && value.length === 8) {
      const info = await getDoc("dni", value);
      if(!info.success) return setError(info.message);
      setFieldValue("rsocial", `${info.apellidoPaterno} ${info.apellidoMaterno} ${info.nombres}`);
    }
  }
}

export const onDepChange = (event, setFieldValue, setCurrentDep) => {
  const value = event.target.value;
  setFieldValue("department", value);
  setCurrentDep(value);
}

export const formatDate = (date) => date.toISOString().split("T")[0];

export const onSearchChange = async (e, isGetting, setSearch, setIsGetting, setSearchClients, setError, clientsBackup) => {
  try {
    if(isGetting) return;
    const value = e.target.value;
    setSearch(value);

    if(value.length >= 3) {
      setIsGetting(true);
      const clients = await apiFetch(`clients/search?param=${value}`);
      setSearchClients(clients);
      setIsGetting(false);
      return;
    }

    setSearchClients(clientsBackup);
  }catch(error) {
    console.error(error);
    setIsGetting(false);
    setError(error.message);
  }
}
