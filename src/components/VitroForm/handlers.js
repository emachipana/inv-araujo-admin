import toast from "react-hot-toast";
import apiFetch from "../../services/apiFetch";
import { getDoc } from "../../services/getByDocument";
import { errorParser } from "../../helpers/errorParser";

export const onDocTypeChange = (event, setFieldValue, setDocType, fieldDoc) => {
  const value = event.target.value;
  setFieldValue(fieldDoc, value);
  setDocType(value);
}

export const onDocChange = async (event, setFieldValue, docType) => {
  const value = event.target.value;
  setFieldValue("document", value);
  setFieldValue("rsocial", "");

  try {
    if(!isNaN(value * 1)) {
      if(docType === "RUC" && value.length === 11) {
        const info = await getDoc("ruc", value);
        if(info.razonSocial) return setFieldValue("rsocial", info.razonSocial);
        toast.error(info.message);
      }
  
      if(docType === "DNI" && value.length === 8) {
        const info = await getDoc("dni", value);
        if(!info.success) return toast.error(info.message);
        setFieldValue("rsocial", `${info.nombres} ${info.apellidoPaterno} ${info.apellidoMaterno}`);
      }
    }
  }catch(e) {
    toast.error(errorParser(e.message));
  }
}

export const onDepChange = (event, setFieldValue, setCurrentDep) => {
  const value = event.target.value;
  setFieldValue("department", value);
  setCurrentDep(value);
}

export const formatDate = (date) => date.toISOString().split("T")[0];

export const onSearchChange = async (e, isGetting, setSearch, setIsGetting, setSearchClients, clientsBackup) => {
  try {
    if(isGetting) return;
    const value = e.target.value;
    setSearch(value);

    if(value.length >= 3) {
      setIsGetting(true);
      const clients = await apiFetch(`clients/search?param=${value}`);
      const filteredClients = {...clients, content: clients.content?.filter((client) => client.createdBy === "ADMINISTRADOR")};
      setSearchClients(filteredClients);
      setIsGetting(false);
      return;
    }

    const filteredClients = {...clientsBackup, content: clientsBackup.content?.filter((client) => client.createdBy === "ADMINISTRADOR")};
    setSearchClients(filteredClients);
  }catch(error) {
    setIsGetting(false);
    toast.error(errorParser(error.message));
  }
}
