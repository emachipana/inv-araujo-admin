import { useEffect, useState } from "react";
import Filter from "../../../components/Filter";
import Tubers from "../../../components/Tubers";
import { Title } from "../styles";
import { Section } from "../Products/styles";
import Modal from "../../../components/Modal";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import Order from "../../../components/Order";
import List from "./List";
import VitroForm from "../../../components/VitroForm";
import { onSearchChange } from "../Products/handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import Pagination from "../../../components/Pagination";
import { FlexRow } from "../../../styles/layout";

function InvitroOrders() {
  const [currentTuber, setCurrentTuber] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("vitroType") || "group");
  const { vitroOrders, isLoading, 
    loadVitroOrders, setIsLoading, setVitroOrders, vitroOrdersBack } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadVitroOrders();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadVitroOrders, setIsLoading ]);

  const resetAtClose = () => {
    setVitroOrders(vitroOrdersBack);
  }

  return (
    <>
      <Title>Invitro</Title>
      <Tubers 
        currentTuber={currentTuber}
        setCurrentTuber={setCurrentTuber}
        isBlocked={isSearching}
        setIsGetting={setIsGetting}
      />
      <Filter 
        setModal={setCreateModal}
        textButton="Nuevo pedido"
        localStorageKey="vitroType"
        setType={setType}
        type={type}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        labelSearch="Buscar pedido..."
        onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setVitroOrders, "vitroOrders", vitroOrdersBack, setIsSearching)}
        searchValue={search}
        setCurrentCategory={setCurrentTuber}
        setSearch={setSearch}
        reset={resetAtClose}
      />
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <p>Ordernar por: </p>
        <Pagination 
          currentPage={vitroOrders.number || 0}
          totalPages={vitroOrders.totalPages}
          isFirst={vitroOrders.first}
          isLast={vitroOrders.last}
        />
      </FlexRow>
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : (type === "group"
              ? vitroOrders.content?.map((order, index) => (
                  <Order
                    id={order.id}
                    key={index}
                    clientName={order.client.rsocial}
                    date={order.finishDate}
                    destination={order.city}
                    total={order.total}
                    status={order.status}
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
        <VitroForm isToCreate />
      </Modal>
    </>
  );
}

export default InvitroOrders;
