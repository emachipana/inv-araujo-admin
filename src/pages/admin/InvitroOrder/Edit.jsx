import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import AlertError from "../../../components/AlertError";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import VitroForm from "../../../components/VitroForm";

function EditVitroOrder() {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const { id } = useParams();
  const { setError, error } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        const order = await apiFetch(`vitroOrders/${id}`);
        setOrder(order.data);
        setIsLoading(false);
      }catch(error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [id, setError]);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !order.destination
          ? <Title>El pedido invitro que quieres editar no existe</Title>
          : <Container>
              <VitroForm 
                initialValues={{
                  ...order,
                  docType: order.documentType === "DNI" ? 1 : 2,
                  status: order.status === "PENDIENTE" ? 1 : (order.status === "ENTREGADO" ? 2 : 3)
                }}
                vitroId={order.id}
                initialDocType={order.documentType === "DNI" ? 1 : 2}
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

export default EditVitroOrder;
