import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../../../context/admin";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import OrderForm from "../../../components/OrderForm";
import AlertError from "../../../components/AlertError";

function EditOrder() {
	const [isLoading, setIsLoading] = useState(true);
	const [order, setOrder] = useState({});
	const { id } = useParams();
	const { setError, error, matcher, departments, provinces, loadDepartments } = useAdmin();

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
					: <Container>
							<OrderForm 
								initialValues={{
									...order,
									...order.client,
									documentType: order.client.documentType === "DNI" ? 1 : 2,
                  status: order.status === "PENDIENTE" ? 1 : (order.status === "ENTREGADO" ? 2 : 3),
                  department: depId,
                  city: provinces[depId].find(prov => prov.nombre_ubigeo === order.city)?.id_ubigeo
								}}
								orderId={order.id}
								initialDocType={order.client.documentType}
								initialDep={depId}
								clientId={order.client.id}
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

export default EditOrder;
