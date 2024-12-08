import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Container } from "../../../components/Categories/styles";
import { Spinner } from "reactstrap";
import Category from "../../../components/Category";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Type({ currentType, setCurrentType, isBlocked, setIsGetting }) {
  const { isLoading, invoicesBackup, setInvoices } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(currentType === "Todo") return setInvoices(invoicesBackup);
        setIsGetting(true);
        const invoices = await apiFetch(`invoices?type=${currentType.toUpperCase()}`);
        setInvoices(invoices);
        setIsGetting(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsGetting(false);
      }
    }

    fetch();
  }, [ currentType, invoicesBackup, setInvoices, setIsGetting ]);

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
