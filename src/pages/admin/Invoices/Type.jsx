import { useAdmin } from "../../../context/admin";
import { Container } from "../../../components/Categories/styles";
import { Spinner } from "reactstrap";
import Category from "../../../components/Category";

function Type({ currentType, setFilters, isBlocked }) {
  const { isLoading } = useAdmin();

  const setCurrentType = (id, name) => {
    if(name === "Todo") return setFilters(filters => ({...filters, invoiceType: {id: null, name: null}, page: 0}));

    setFilters(filters => ({...filters, invoiceType: {id, name}, page: 0}));
  };

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            <Category
              isBlocked={isBlocked}
              id={null}
              name="Todo"
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
            <Category
              isBlocked={isBlocked}
              id="FACTURA"
              name="Factura"
              currentCategory={currentType}
              setCurrentCategory={setCurrentType}
            />
            <Category 
              id="BOLETA"
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
