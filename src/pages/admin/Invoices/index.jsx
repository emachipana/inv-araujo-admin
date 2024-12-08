import { useEffect, useState } from "react";
import Filter from "../../../components/Filter";
import { Title } from "../styles";
import Type from "./Type";
import { Section } from "../Products/styles";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import List from "./List";
import Invoice from "../../../components/Order/Invoice";
import Modal from "../../../components/Modal";
import InvoiceForm from "../../../components/InvoiceForm";
import { onSearchChange } from "../Products/handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Invoices() {
  const [currentType, setCurrentType] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("invoiceType") || "group");
  const { isLoading, setIsLoading, loadInvoices, invoices, setInvoices, invoicesBackup } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadInvoices();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadInvoices, setIsLoading ]);
  
  return (
    <>
      <Title>Comprobantes</Title>
      <Type 
        currentType={currentType}
        isBlocked={isSearching}
        setCurrentType={setCurrentType}
        setIsGetting={setIsGetting}
      />
      <Filter 
        setModal={setCreateModal}
        textButton="Nuevo comprobante"
        localStorageKey="invoiceType"
        setType={setType}
        type={type}
        isSearching={isSearching}
        labelSearch="Buscar comprobante..."
        onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setInvoices, "invoices", invoicesBackup, setIsSearching)}
        searchValue={search}
        setCurrentCategory={setCurrentType}
        setIsSearching={setIsSearching}
      />
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : (type === "group"
              ? invoices.map((invoice, index) => (
                  <Invoice 
                    key={index}
                    id={invoice.id}
                    rsocial={invoice.rsocial}
                    date={invoice.issueDate}
                    type={invoice.invoiceType}
                    document={invoice.document}
                    total={invoice.total}
                  />
                ))
              : <List />
            )
        }
      </Section>
      <Modal
        size="md"
        isActive={createModal}
        setIsActive={setCreateModal}
      >
        <InvoiceForm isToCreate />
      </Modal>
    </>
  );
}

export default Invoices;
