import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import Filter from "../../../components/Filter";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import Order from "../../../components/Order";
import List from "./List";
import Modal from "../../../components/Modal";
import OrderForm from "../../../components/OrderForm";
import Status from "./Status";
import { onSearchChange } from "../Products/handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Orders() {
  const [currentStatus, setCurrentStatus] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("ordersType") || "group");
  const { orders, isLoading, setIsLoading, 
    matcher, loadOrders, setOrders, ordersBackup } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.orders) {
          setIsLoading(true);
          await loadOrders();
          setIsLoading(false);
        }
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadOrders, setIsLoading, matcher.orders ]);

  return (
    <>
      <Title>Pedidos</Title>
      <Status 
        currentStatus={currentStatus}
        isBlocked={isSearching}
        setCurrentStatus={setCurrentStatus}
        setIsGetting={setIsGetting}
      />
      <Filter
        setModal={setCreateModal}
        textButton="Nuevo pedido"
        localStorageKey="ordersType"
        setType={setType}
        type={type}
        isSearching={isSearching}
        labelSearch="Buscar pedido..."
        onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setOrders, "orders", ordersBackup, setIsSearching)}
        searchValue={search}
        setCurrentCategory={setCurrentStatus}
        setIsSearching={setIsSearching}
      />
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : (type === "group"
              ? orders.map((order, index) => (
                  <Order 
                    clientName={order.client.rsocial}
                    id={order.id}
                    key={index}
                    date={order.maxShipDate}
                    total={order.total}
                    destination={order.city}
                    status={order.status}
                    isOrder
                  />
                ))
              : <List />
            )
        }
      </Section>
      <Modal
        align="start"
        size="md"
        isActive={createModal}
        setIsActive={setCreateModal}
      >
        <OrderForm isToCreate />
      </Modal>
    </>
  );
}

export default Orders;
