import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Container } from "../Product/styles";
import InvoiceForm from "../../../components/InvoiceForm";
import { Title } from "../styles";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function EditInvoice() {
  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        const invoice = await apiFetch(`invoices/${id}`);
        setInvoice(invoice.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

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
                  issueDate: invoice.issueDate.split("T")[0]
                }}
                invoiceId={invoice.id}
                initDocType={invoice.documentType}
                initInvoiceType={invoice.invoiceType}
                isGenerated={invoice.isGenerated}
              />
            </Container>
        }
      </>
  );
}

export default EditInvoice;
