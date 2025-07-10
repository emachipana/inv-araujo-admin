import { useAdmin } from "../../../context/admin";
import { Container } from "../../../components/Categories/styles";
import { Spinner } from "reactstrap";
import Category from "../../../components/Category";

function Status({ currentStatus, setFilters, isBlocked }) {
  const { isLoading } = useAdmin();

  const setCurrent = (id, name) => {
    if(name === "Todo") return setFilters(filters => ({...filters, status: {id: null, name: null}, page: 0}));

    setFilters(filters => ({...filters, status: {id, name}, page: 0}));
  }

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
              currentCategory={currentStatus}
              setCurrentCategory={setCurrent}
            />
            <Category
              isBlocked={isBlocked}
              id="ENTREGADO"
              name="Entregado"
              currentCategory={currentStatus}
              setCurrentCategory={setCurrent}
            />
            <Category 
              id="PENDIENTE"
              name="Pendiente"
              isBlocked={isBlocked}
              currentCategory={currentStatus}
              setCurrentCategory={setCurrent}
            />
            <Category
              id="PAGADO"
              name="Pagado"
              isBlocked={isBlocked}
              currentCategory={currentStatus}
              setCurrentCategory={setCurrent}
            />
            <Category
              id="CANCELADO"
              name="Cancelado"
              isBlocked={isBlocked}
              currentCategory={currentStatus}
              setCurrentCategory={setCurrent}
            />
          </>
      }
    </Container>
  );
}

export default Status;
