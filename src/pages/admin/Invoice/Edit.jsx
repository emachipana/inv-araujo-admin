import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Container } from "../Product/styles";
import InvoiceForm from "../../../components/InvoiceForm";
import AlertError from "../../../components/AlertError";
import { Title } from "../styles";

function EditInvoice() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState({});
  const { id } = useParams();
  const { setError, error } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        const invoice = await apiFetch(`invoices/${id}`);
        setInvoice(invoice.data);
        setIsLoading(false);
      }catch(error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id, setError ]);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !invoice.rsocial
          ? <Title>El comprobante no existe</Title>
          : <Container>
              <InvoiceForm 
                initialValues={{
                  ...invoice,
                  documentType: invoice.documentType === "DNI" ? 1 : 2,
                  invoiceType: invoice.invoiceType === "BOLETA" ? 1 : 2
                }}
                invoiceId={invoice.id}
                initDocType={invoice.documentType}
                initInvoiceType={invoice.invoiceType}
                isGenerated={invoice.isGenerated}
              />
            </Container>
        }
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

export default EditInvoice;
