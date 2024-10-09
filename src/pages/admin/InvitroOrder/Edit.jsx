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
  const { setError, error, matcher, departments, provinces, loadDepartments } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.departments) loadDepartments();
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
  }, [id, setError, loadDepartments, matcher.departments ]);

  const departmentId = departments.find(dep => dep.nombre_ubigeo === order.department)?.id_ubigeo;

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !order.city
          ? <Title>El pedido invitro que quieres editar no existe</Title>
          : <Container>
              <VitroForm 
                initialValues={{
                  ...order,
                  docType: order.documentType === "DNI" ? 1 : 2,
                  status: order.status === "PENDIENTE" ? 1 : (order.status === "ENTREGADO" ? 2 : 3),
                  department: departmentId,
                  city: provinces[departmentId].find(prov => prov.nombre_ubigeo === order.city)?.id_ubigeo
                }}
                vitroId={order.id}
                initialDocType={order.documentType}
                initialDep={departmentId}
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
