import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import VitroForm from "../../../components/VitroForm";
import { Section } from "./styles";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { departments, provinces } from "../../../data/places";

function EditVitroOrder() {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        const order = await apiFetch(`vitroOrders/${id}`);
        setOrder(order.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

  const departmentId = departments.find(dep => dep.nombre_ubigeo === order.department)?.id_ubigeo;

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !order.city
          ? <Title>El pedido invitro que quieres editar no existe</Title>
          : <Section>
              <Container>
                <VitroForm 
                  initialValues={{
                    ...order.client,
                    ...order,
                    documentType: order.client.documentType === "DNI" ? 1 : 2,
                    department: departmentId,
                    city: provinces[departmentId]?.find(prov => prov.nombre_ubigeo === order.city)?.id_ubigeo,
                    shippingType: order.shippingType === "RECOJO_ALMACEN" ? 1 : 2,
                  }}
                  vitroId={order.id}
                  initialDocType={order.client.documentType}
                  initialDep={departmentId}
                  clientId={order.client.id}
                  invoice={order.invoice}
                  evidence={order.evidence}
                  employee={order.employee}
                  setIsActive={() => {}}
                />
              </Container>
            </Section>
        }
      </>
  );
}

export default EditVitroOrder;
