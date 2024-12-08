import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import VitroForm from "../../../components/VitroForm";
import { Section } from "./styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import Button from "../../../components/Button";
import Badge from "../../../components/Badge";
import { updateStatus } from "./handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function EditVitroOrder() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [order, setOrder] = useState({});
  const { id } = useParams();
  const { matcher, departments, provinces, loadDepartments, updateVitro } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.departments) loadDepartments();
        const order = await apiFetch(`vitroOrders/${id}`);
        setOrder(order.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [id, loadDepartments, matcher.departments ]);

  const departmentId = departments.find(dep => dep.nombre_ubigeo === order.department)?.id_ubigeo;

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !order.city
          ? <Title>El pedido invitro que quieres editar no existe</Title>
          : <Section>
              <Container notAuto>
                <FlexColumn gap={1.5}>
                  <FlexRow>
                    <Text
                      size={16.7}
                      weight={700}
                    >
                      Estado actual: 
                    </Text>
                    <Badge 
                      color={order.status === "PENDIENTE" ? "warning" : "primary"}
                    >
                      { order.status }
                    </Badge>
                  </FlexRow>
                  <Button
                    fontSize={14.5}
                    style={{padding: ".3rem .5rem", alignSelf: "center"}}
                    color={order.status === "PENDIENTE" ? "primary" : "warning"}
                    onClick={() => updateStatus(order, updateVitro, setIsUpdating, navigate, "invitro", order.invoice)}
                  >
                    {
                      isUpdating
                      ? <>
                          <Spinner size="sm" />
                          Actualizando...
                        </>
                      : `¿Marcar como ${ order.status === "PENDIENTE" ? "entregado" : "pendiente" }?`
                    }
                  </Button>
                </FlexColumn>
              </Container>
              <Container notAuto>
                <VitroForm 
                  initialValues={{
                    ...order.client,
                    ...order,
                    documentType: order.client.documentType === "DNI" ? 1 : 2,
                    department: departmentId,
                    city: provinces[departmentId].find(prov => prov.nombre_ubigeo === order.city)?.id_ubigeo
                  }}
                  vitroId={order.id}
                  initialDocType={order.client.documentType}
                  initialDep={departmentId}
                  clientId={order.client.id}
                  invoice={order.invoice}
                />
              </Container>
            </Section>
        }
      </>
  );
}

export default EditVitroOrder;
