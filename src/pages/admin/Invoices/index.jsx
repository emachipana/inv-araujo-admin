import { useEffect, useState } from "react";
import Filter from "../../../components/Filter";
import { Title } from "../styles";
import Type from "./Type";
import { Section } from "../Products/styles";
import { useAdmin } from "../../../context/admin";
import AlertError from "../../../components/AlertError";
import { Spinner } from "reactstrap";
import List from "./List";
import Invoice from "../../../components/Order/Invoice";
import Modal from "../../../components/Modal";
import InvoiceForm from "../../../components/InvoiceForm";

function Invoices() {
  const [createModal, setCreateModal] = useState(false);
  const [type, setType] = useState(localStorage.getItem("invoiceType") || "group");
  const { error, setError, isLoading, setIsLoading, matcher, loadInvoices, invoices } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.invoices) await loadInvoices();
      }catch(error) {
        setIsLoading(false);
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [ loadInvoices, matcher.invoices, setError, setIsLoading ]);
  
  return (
    <>
      <Title>Comprobantes</Title>
      <Type />
      <Filter 
        setModal={setCreateModal}
        textButton="Nuevo comprobante"
        localStorageKey="invoiceType"
        setType={setType}
        type={type}
      />
      <Section>
        {
          isLoading
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
      {
        error
        &&
        <AlertError 
          error={error}
          setError={setError}
        />
      }
    </>
  );
}

export default Invoices;
