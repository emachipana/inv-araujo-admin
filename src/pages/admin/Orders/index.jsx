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
import { filterBuilder } from "./filter";
import apiFetch from "../../../services/apiFetch";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Button from "../../../components/Button";
import { FaBasketShopping } from "react-icons/fa6";
import { HeaderPage, MenuSection } from "../InvitroOrders/styles";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { FaCalendar } from "react-icons/fa";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { TbSitemapFilled } from "react-icons/tb";
import { sortData } from "../InvitroOrders/data";
import { RiFilterOffFill } from "react-icons/ri";
import Pagination from "../../../components/Pagination";
import { useModal } from "../../../context/modal";
import { useAuth } from "../../../context/auth";

function Orders() {
  const [filters, setFilters] = useState({
    status: {id: null, name: null},
    sort: null,
    range: 0,
    page: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [isRangeDateOpen, setIsRangeDateOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [type, setType] = useState(localStorage.getItem("ordersType") || "group");
  const { orders, isLoading, setIsLoading, loadOrders, setOrders, ordersBackup } = useAdmin();
  const { ordersModal: createModal, setOrdersModal: setCreateModal } = useModal();
  const { user } = useAuth();

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

  useEffect(() => {
    const fetch = async () => {
      if(!filters.status.id && !filters.sort && !filters.range && !filters.page) return setOrders(ordersBackup);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const orders = await apiFetch(`orders${params}`);
        setOrders(orders);
        setIsGetting(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsGetting(false);
      }
    }

    fetch();
  }, [ filters, ordersBackup, setOrders, setIsGetting ]);

  const onClickSort = (name) => {
    if(filters.sort === name) return;

    setFilters({...filters, sort: name, page: 0});
    setIsSortOpen(false);
  }

  const onClickRange = (name) => {
    if(filters.range === name) return;

    setFilters({...filters, range: name, page: 0});
    setIsRangeDateOpen(false);
  }

  return (
    <>
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <FlexColumn gap={0.1}>
          <Title>Pedidos</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los pedidos de tu tienda
          </Text>
        </FlexColumn>
        {
          user.role.permissions.includes("ORDERS_CREATE")
          &&
          <Button
            onClick={() => setCreateModal(!createModal)}
            fontSize={15}
            Icon={FaBasketShopping}
            iconSize={18}
          >
            Nuevo pedido
          </Button>
        }
      </FlexRow>
      <HeaderPage>
        <Status 
          currentStatus={filters.status?.name}
          isBlocked={isSearching}
          setFilters={setFilters}
        />
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Filter
            localStorageKey="ordersType"
            setType={setType}
            type={type}
            isSearching={isSearching}
            labelSearch="Buscar pedido..."
            onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setOrders, "orders", ordersBackup, setIsSearching)}
            searchValue={search}
            setIsSearching={setIsSearching}
            reset={() => setSearch("")}
            resetFilters={() => setFilters(filters => ({...filters, status: {id: null, name: null}, sort: null, range: null, page: 0 }))}
          />
          <FlexRow gap={1}>
            <DropDown
              Button={SelectButton}
              buttonData={{
                Icon: FaCalendar,
                children: `${sortData[filters.range] || "Rango de fechas"}`,
                isActive: !!filters.range,
              }}
              isOpen={isRangeDateOpen}
              setIsOpen={setIsRangeDateOpen}
            >
              <MenuSection>
                <SelectItem
                  onClick={() => onClickRange("TODAY")}
                  isActive={filters.range === "TODAY"}
                >
                  Hoy
                </SelectItem>
                <SelectItem
                  onClick={() => onClickRange("TOMORROW")}
                  isActive={filters.range === "TOMORROW"}
                >
                  Mañana
                </SelectItem>
                <SelectItem
                  onClick={() => onClickRange("THIS_MONTH")}
                  isActive={filters.range === "THIS_MONTH"}
                >
                  Este mes
                </SelectItem>
              </MenuSection>
            </DropDown>
            <DropDown
              Button={SelectButton}
              buttonData={{
                Icon: TbSitemapFilled,
                children: `${sortData[filters.sort] || "Ordernar por"}`,
                isActive: !!filters.sort,
              }}
              isOpen={isSortOpen}
              setIsOpen={setIsSortOpen}
            >
              <MenuSection>
                <SelectItem
                  minWidth={200}
                  onClick={() => onClickSort("DATE_NEW_TO_OLD")}
                  isActive={filters.sort === "DATE_NEW_TO_OLD"}
                >
                  Fecha (reciente a antiguo)
                </SelectItem>
                <SelectItem
                  minWidth={200}
                  onClick={() => onClickSort("DATE_OLD_TO_NEW")}
                  isActive={filters.sort === "DATE_OLD_TO_NEW"}
                >
                  Fecha (antiguo a reciente)
                </SelectItem>
                <SelectItem
                  minWidth={200}
                  onClick={() => onClickSort("AMOUNT_HIGH_TO_LOW")}
                  isActive={filters.sort === "AMOUNT_HIGH_TO_LOW"}
                >
                  Monto (mayor a menor)
                </SelectItem>
                <SelectItem
                  minWidth={200}
                  onClick={() => onClickSort("AMOUNT_LOW_TO_HIGH")}
                  isActive={filters.sort === "AMOUNT_LOW_TO_HIGH"}
                >
                  Monto (menor a mayor)
                </SelectItem>
              </MenuSection>
            </DropDown>
            {
              (filters.sort || filters.range || filters.status.id)
              && 
              <Button
                onClick={() => setFilters(filters => ({...filters, sort: null, range: null, status: {id: null, name: null}, page: 0}))}
                Icon={RiFilterOffFill}
                fontSize={14}
                color="danger"
                iconSize={14}
                style={{padding: "0.25rem 0.5rem"}}
              >
                Limpiar
              </Button>
            }
          </FlexRow>
        </FlexRow>
      </HeaderPage>
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
      <Pagination 
        currentPage={orders.number}
        // totalPages={orders.totalPages}
        totalPages={200}
        setFilters={setFilters}
        isLoading={isLoading || isGetting}
      />
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
