import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import OrderForm from "../../../components/OrderForm";
import AlertError from "../../../components/AlertError";
import { Section } from "../InvitroOrder/styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import { updateStatus } from "../InvitroOrder/handlers";

function EditOrder() {
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [order, setOrder] = useState({});
	const { id } = useParams();
	const { setError, error, matcher, departments, provinces, loadDepartments, updateOrder } = useAdmin();
	const navigate = useNavigate();

	useEffect(() => {
		const fetch = async () => {
			try {
				if(!matcher.departments) loadDepartments();
				const order = await apiFetch(`orders/${id}`);
				setOrder(order.data);
				setIsLoading(false);
			}catch(error) {
				console.error(error);
				setError(error.message);
				setIsLoading(false);
			}
		}

		fetch();
	}, [id, setError, matcher.departments, loadDepartments]);

	const depId = departments.find(dep => dep.nombre_ubigeo === order.department)?.id_ubigeo;

	return (
		isLoading
		? <Spinner color="secondary" />
		: <>
				{
					!order.city
					? <Title>El pedido que quieres editar no existe</Title>
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
                    onClick={() => updateStatus(order, updateOrder, setIsUpdating, setError, navigate, "pedidos", order.invoice)}
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
									<OrderForm 
										initialValues={{
											...order,
											...order.client,
											documentType: order.client.documentType === "DNI" ? 1 : 2,
											department: depId,
											city: provinces[depId].find(prov => prov.nombre_ubigeo === order.city)?.id_ubigeo,
											initDate: order.date
										}}
										orderId={order.id}
										initialDocType={order.client.documentType}
										initialDep={depId}
										clientId={order.client.id}
										invoice={order.invoice}
									/>
								</Container>
						</Section>
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

export default EditOrder;
