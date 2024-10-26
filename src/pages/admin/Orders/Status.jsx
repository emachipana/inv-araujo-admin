import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Container } from "../../../components/Categories/styles";
import { Spinner } from "reactstrap";
import Category from "../../../components/Category";

function Status({ currentStatus, setCurrentStatus, isBlocked, setIsGetting }) {
  const { isLoading, ordersBackup, setOrders, setError } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(currentStatus === "Todo") return setOrders(ordersBackup);
        setIsGetting(true);
        const orders = await apiFetch(`orders?status=${currentStatus.toUpperCase()}`);
        setOrders(orders);
        setIsGetting(false);
      }catch(error) {
        setIsGetting(false);
        console.error(error);
        setError(error.message);
      }
    }

    fetch();
  }, [ currentStatus, ordersBackup, setError, setOrders, setIsGetting ]);

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            <Category
              isBlocked={isBlocked}
              name="Todo"
              currentCategory={currentStatus}
              setCurrentCategory={setCurrentStatus}
            />
            <Category
              isBlocked={isBlocked}
              name="Entregado"
              currentCategory={currentStatus}
              setCurrentCategory={setCurrentStatus}
            />
            <Category 
              name="Pendiente"
              isBlocked={isBlocked}
              currentCategory={currentStatus}
              setCurrentCategory={setCurrentStatus}
            />
          </>
      }
    </Container>
  );
}

export default Status;
