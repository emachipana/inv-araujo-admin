import { useEffect, useState } from "react";
import Filter from "../../../components/Filter";
import Tubers from "../../../components/Tubers";
import { Title } from "../styles";
import { Section } from "../Products/styles";
import Modal from "../../../components/Modal";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import OrderCard from "../../../components/OrderCard";
import VitroForm from "../../../components/VitroForm";
import { onSearchChange } from "../Products/handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import Pagination from "../../../components/Pagination";

function InvitroOrders() {
  const [currentTuber, setCurrentTuber] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("vitroType") || "group");
  const { vitroOrders, isLoading, 
    loadVitroOrders, setIsLoading, setVitroOrders, vitroOrdersBack } = useAdmin();

    console.log(vitroOrders);

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
      <Pagination
        style={{alignSelf: "flex-end"}}
        currentPage={vitroOrders.number || 0}
        totalPages={vitroOrders.totalPages}
        isFirst={vitroOrders.first}
        isLast={vitroOrders.last}
      />
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : vitroOrders.content?.map((order, index) => (
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
        <VitroForm isToCreate />
      </Modal>
    </>
  );
}

export default InvitroOrders;
