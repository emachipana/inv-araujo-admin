import { useEffect, useState } from "react";
import Filter from "../../../components/Filter";
import Tubers from "../../../components/Tubers";
import { Title } from "../styles";
import { Section } from "../Products/styles";
import Modal from "../../../components/Modal";
import { useAdmin } from "../../../context/admin";
import AlertError from "../../../components/AlertError";
import { Spinner } from "reactstrap";
import Order from "../../../components/Order";
import List from "./List";
import VitroForm from "../../../components/VitroForm";
import { onSearchChange } from "../Products/handlers";

function InvitroOrders() {
  const [currentTuber, setCurrentTuber] = useState("Todo");
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("vitroType") || "group");
  const { error, setError, vitroOrders, isLoading, 
    loadVitroOrders, setIsLoading, matcher,
    setVitroOrders, vitroOrdersBack } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.vitroOrders) {
          setIsLoading(true);
          await loadVitroOrders();
          setIsLoading(false);
        }
      }catch(error) {
        console.error(error);
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadVitroOrders, setError, setIsLoading, matcher.vitroOrders ]);

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
        onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setVitroOrders, "vitroOrders", vitroOrdersBack, setError, setIsSearching)}
        searchValue={search}
        setCurrentCategory={setCurrentTuber}
      />
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : (type === "group"
              ? vitroOrders.map((order, index) => (
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
      {
        error
        &&
        <AlertError 
          from="invitro"
          error={error}
          setError={setError}
        />
      }
    </>
  );
}

export default InvitroOrders;
