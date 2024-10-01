import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import Filter from "../../../components/Filter";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import Order from "../../../components/Order";
import AlertError from "../../../components/AlertError";
import List from "./List";
import Modal from "../../../components/Modal";
import OrderForm from "../../../components/OrderForm";

function Orders() {
  const [createModal, setCreateModal] = useState(false);
  const [type, setType] = useState(localStorage.getItem("ordersType") || "group");
  const { error, setError, orders, isLoading, setIsLoading, matcher, loadOrders } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.orders) {
          await loadOrders();
        }
      }catch(error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadOrders, setError, setIsLoading, matcher.orders ]);

  return (
    <>
      <Title>Pedidos</Title>
      <Filter
        setModal={setCreateModal}
        textButton="Nuevo pedido"
        localStorageKey="ordersType"
        setType={setType}
        type={type}
      />
      <Section>
        {
          isLoading
          ? <Spinner color="secondary" />
          : (type === "group"
              ? orders.map((order, index) => (
                  <Order 
                    clientName={`${order.client.firstName} ${order.client.lastName}`}
                    id={order.id}
                    key={index}
                    date={order.date}
                    ship={order.shippingType}
                    destination={order.destination}
                    status={order.status}
                  />
                ))
              : <List />
            )
        }
      </Section>
      <Modal
        size="md"
        isActive={createModal}
        setIsActive={setCreateModal}
      >
        <OrderForm isToCreate />
      </Modal>
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

export default Orders;
