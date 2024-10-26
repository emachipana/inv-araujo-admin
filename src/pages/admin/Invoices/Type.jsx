import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Container } from "../../../components/Categories/styles";
import { Spinner } from "reactstrap";
import Category from "../../../components/Category";

function Type({ currentType, setCurrentType, isBlocked, setIsGetting }) {
  const { isLoading, invoicesBackup, setInvoices, setError } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(currentType === "Todo") return setInvoices(invoicesBackup);
        setIsGetting(true);
        const invoices = await apiFetch(`invoices?type=${currentType.toUpperCase()}`);
        setInvoices(invoices);
        setIsGetting(false);
      }catch(error) {
        setIsGetting(false);
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [ currentType, invoicesBackup, setError, setInvoices, setIsGetting ]);

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            <Category
              isBlocked={isBlocked}
              name="Todo"
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
            <Category
              isBlocked={isBlocked}
              name="Factura"
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
            <Category 
              name="Boleta"
              isBlocked={isBlocked}
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
          </>
      }
    </Container>
  );
}

export default Type;
