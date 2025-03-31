import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { Spinner } from "reactstrap";
import { Title } from "../styles";
import { Container } from "../Product/styles";
import OrderForm from "../../../components/OrderForm";
import { Section } from "../InvitroOrder/styles";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { departments, provinces } from "../../../data/places";

function EditOrder() {
	const [isLoading, setIsLoading] = useState(true);
	const [order, setOrder] = useState({});
	const { id } = useParams();

	useEffect(() => {
		const fetch = async () => {
			try {
				const order = await apiFetch(`orders/${id}`);
				setOrder(order.data);
				setIsLoading(false);
			}catch(error) {
				toast.error(errorParser(error.message));
				setIsLoading(false);
			}
		}

		fetch();
	}, [ id ]);

	const depId = departments.find(dep => dep.nombre_ubigeo === order.department)?.id_ubigeo;

	return (
		isLoading
		? <Spinner color="secondary" />
		: <>
				{
					!order.city
					? <Title>El pedido que quieres editar no existe</Title>
					: <Section>
							<Container>
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
									evidence={order.evidence}
									employee={order.employee}
								/>
								</Container>
						</Section>
				}
			</>
	);
}

export default EditOrder;
