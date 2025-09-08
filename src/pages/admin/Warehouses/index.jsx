import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { filterBuilder } from "./filter";
import apiFetch from "../../../services/apiFetch";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { Title } from "../styles";
import Button from "../../../components/Button";
import { FaWarehouse } from "react-icons/fa";
import { COLORS } from "../../../styles/colors";
import { HeaderPage, MenuSection } from "../InvitroOrders/styles";
import { onSearchChange } from "../Products/handlers";
import Filter from "../../../components/Filter";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { TbSitemapFilled } from "react-icons/tb";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { useModal } from "../../../context/modal";
import { useAuth } from "../../../context/auth";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import Modal from "../../../components/Modal";
import WarehouseForm from "../../../components/WarehouseForm";
import WarehouseCard from "../../../components/WarehouseCard";

function Warehouses() {
  const [filters, setFilters] = useState({
    sort: null
  });
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [type, setType] = useState(localStorage.getItem("warehousesType") || "group");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { warehouses, isLoading, setIsLoading, loadWarehouses, setWarehouses, warehousesBackup } = useAdmin();
  const { warehousesModal: createModal, setWarehousesModal: setCreateModal } = useModal();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadWarehouses();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [loadWarehouses, setIsLoading]);

  useEffect(() => {
    const fetch = async () => {
      if(!filters.sort) return setWarehouses(warehousesBackup);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const warehouses = await apiFetch(`warehouses${params}`);
        setWarehouses(warehouses);
        setIsGetting(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsGetting(false);
      }
    }

    fetch();
  }, [filters, setWarehouses, warehousesBackup, setIsGetting]);

  return (
    <>
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <FlexColumn>
          <Title>Almacenes</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los almacenes de tu tienda
          </Text>
        </FlexColumn>
        {
          user.role.permissions.includes("WAREHOUSES_CREATE")
          &&
          <Button
            onClick={() => setCreateModal(true)}
            fontSize={15}
            Icon={FaWarehouse}
            iconSize={18}
          >
            Nuevo almacén
          </Button>
        }
      </FlexRow>
      <HeaderPage>
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Filter
            localStorageKey="warehousesType"
            setType={setType}
            type={type}
            isSearching={isSearching}
            labelSearch="Buscar almacén..."
            onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setWarehouses, "warehouses", warehousesBackup, setIsSearching)}
            searchValue={search}
            setIsSearching={setIsSearching}
            resetFilters={() => setFilters(filters => ({...filters, sort: null }))}
            reset={() => setSearch("")}
          />
          <DropDown
            Button={SelectButton}
            buttonData={{
              Icon: TbSitemapFilled,
              children: "Ordernar por",
            }}
            isOpen={isSortOpen}
            setIsOpen={setIsSortOpen}
          >
            <MenuSection>
              <SelectItem
                minWidth={195}
              >
                Reciente a antiguo
              </SelectItem>
              <SelectItem
                minWidth={195}
              >
                Antiguo a reciente
              </SelectItem>
              <SelectItem
                minWidth={195}
              >
                Mayor consumo a menor
              </SelectItem>
              <SelectItem
                minWidth={195}
              >
                Menor consumo a mayor
              </SelectItem>
            </MenuSection>
          </DropDown>
        </FlexRow>
      </HeaderPage>
      <Section>
        {
          isLoading
          ? <Spinner color="secondary" />
          : warehouses.map((warehouse, index) => (
              <WarehouseCard
                key={index}
                name={`Almacén ${warehouse.name}`}
                location={`${warehouse.province}, ${warehouse.department}`}
              />
            ))
        }
      </Section>
      <Modal
        isActive={createModal}
        setIsActive={setCreateModal}
        size="md"
        align="flex-start"
      >
        <WarehouseForm
          isToCreate
          setIsActive={setCreateModal}
        />
      </Modal>
    </>
  );
}

export default Warehouses;
