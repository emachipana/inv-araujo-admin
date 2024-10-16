import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Container } from "../../../components/Categories/styles";
import { Spinner } from "reactstrap";
import Category from "../../../components/Category";

function Type() {
  const [currentType, setCurrentType] = useState("Todo");
  const { isLoading, invoicesBackup, setInvoices, setError } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(currentType === "Todo") return setInvoices(invoicesBackup);
        const invoices = await apiFetch(`invoices?type=${currentType.toUpperCase()}`);
        setInvoices(invoices);
      }catch(error) {
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [ currentType, invoicesBackup, setError, setInvoices ]);

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            <Category 
              name="Todo"
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
            <Category 
              name="Factura"
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
            <Category 
              name="Boleta"
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
          </>
      }
    </Container>
  );
}

export default Type;
