import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import Filter from "../../../components/Filter";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import OrderCard from "../../../components/OrderCard";
import Modal from "../../../components/Modal";
import OrderForm from "../../../components/OrderForm";
import Status from "./Status";
import { onSearchChange } from "../Products/handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import Pagination from "../../../components/Pagination";

function Orders() {
  const [currentStatus, setCurrentStatus] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("ordersType") || "group");
  const { orders, isLoading, setIsLoading, loadOrders, setOrders, ordersBackup } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadOrders();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadOrders, setIsLoading ]);

  const resetAtClose = () => {
    setCurrentStatus("Todo");
    setOrders(ordersBackup);
  }

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
        setIsSearching={setIsSearching}
        setSearch={setSearch}
        reset={resetAtClose}
      />
      <Pagination
        currentPage={orders.number || 0}
        totalPages={orders.totalPages}
        isFirst={orders.first}
        isLast={orders.last}
        style={{alignSelf: "flex-end"}}
      />
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : orders.content?.map((order, index) => (
              <OrderCard
                key={index}
                order={order}
                fullSize={type === "list"}
              />
            ))
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
