import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [vitroModal, setVitroModal] = useState(false);
  const [productsModal, setProductsModal] = useState(false);
  const [ordersModal, setOrdersModal] = useState(false);
  const [invoicesModal, setInvoicesModal] = useState(false);
  const [bannersModal, setBannersModal] = useState(false);
  const [clientsModal, setClientsModal] = useState(false);
  const [employeesModal, setEmployeesModal] = useState(false);
  const [warehousesModal, setWarehousesModal] = useState(false);
  const [productsBatchModal, setProductsBatchModal] = useState(false);

  return (
    <ModalContext.Provider value={{
      productsBatchModal,
      setProductsBatchModal,
      vitroModal, 
      setVitroModal,
      productsModal,
      setProductsModal,
      ordersModal,
      setOrdersModal,
      invoicesModal,
      setInvoicesModal,
      bannersModal,
      setBannersModal,
      clientsModal,
      setClientsModal,
      employeesModal,
      setEmployeesModal,
      warehousesModal,
      setWarehousesModal,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

const useModal = () => useContext(ModalContext);

export { ModalProvider, useModal };
