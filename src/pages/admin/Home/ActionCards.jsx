import { FlexRow } from "../../../styles/layout";
import ActionCard from "../../../components/ActionCard";
import { useModal } from "../../../context/modal";

function ActionCards({ permissions }) {
  const { setVitroModal, setProductsModal, setOrdersModal, setInvoicesModal, setBannersModal, setClientsModal, setWarehousesModal, setProductsBatchModal } = useModal();

  return (
    <FlexRow
      width="100%"
      justify="space-around"
      gap={1}
      style={{ padding: "1rem 0.5rem" }}
    >
      {
        permissions.includes("INVITRO_CREATE") 
        &&
        <ActionCard
          type="INVITRO_CREATE"
          navigateTo="/invitro"
          setModal={setVitroModal}
        />
      }
      {
        permissions.includes("ORDERS_CREATE") 
        &&
        <ActionCard
          type="ORDERS_CREATE"
          navigateTo="/pedidos"
          setModal={setOrdersModal}
        />
      }
      {
        permissions.includes("PRODUCTS_CREATE") 
        &&
        <ActionCard
          type="PRODUCTS_CREATE"
          navigateTo="/productos"
          setModal={setProductsModal}
        />
      }
      {
        permissions.includes("INVOICES_CREATE") 
        &&
        <ActionCard
          type="INVOICES_CREATE"
          navigateTo="/comprobantes"
          setModal={setInvoicesModal}
        />
      }
      {
        permissions.includes("BANNERS_CREATE") 
        &&
        <ActionCard
          type="BANNERS_CREATE"
          navigateTo="/banners"
          setModal={setBannersModal}
        />
      }
      {
        permissions.includes("CLIENTS_CREATE") 
        &&
        <ActionCard
          type="CLIENTS_CREATE"
          navigateTo="/clientes"
          setModal={setClientsModal}
        />
      }
      {
        permissions.includes("WAREHOUSES_CREATE") 
        &&
        <ActionCard
          type="WAREHOUSES_CREATE"
          navigateTo="/almacenes"
          setModal={setWarehousesModal}
        />
      }
      {
        permissions.includes("PRODUCTS_BATCH_CREATE") 
        &&
        <ActionCard
          type="PRODUCTS_BATCH_CREATE"
          navigateTo="/productos"
          setModal={setProductsBatchModal}
        />
      }
      {
        permissions.includes("EXPENSES_CREATE")
        &&
        <ActionCard
          type="EXPENSES_CREATE"
          navigateTo="/gastos"
          setModal={() => {}}
        />
      }
    </FlexRow>
  );
};

export default ActionCards;

