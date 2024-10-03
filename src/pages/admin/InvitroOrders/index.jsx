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

function InvitroOrders() {
  const [createModal, setCreateModal] = useState(false);
  const [type, setType] = useState(localStorage.getItem("vitroType") || "group");
  const { error, setError, vitroOrders, isLoading, loadVitroOrders, setIsLoading, matcher } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(!matcher.vitroOrders) await loadVitroOrders();
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
      <Tubers />
      <Filter 
        setModal={setCreateModal}
        textButton="Nuevo pedido"
        localStorageKey="vitroType"
        setType={setType}
        type={type}
      />
      <Section>
        {
          isLoading
          ? <Spinner color="secondary" />
          : (type === "group"
              ? vitroOrders.map((order, index) => (
                  <Order
                    id={order.id}
                    key={index}
                    clientName={`${order.firstName} ${order.lastName}`}
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
