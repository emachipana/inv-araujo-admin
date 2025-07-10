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
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { PiPlantFill } from "react-icons/pi";
import Button from "../../../components/Button";
import { COLORS } from "../../../styles/colors";
import { HeaderPage, MenuSection } from "./styles";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { FaCalendar } from "react-icons/fa6";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { filterBuilder } from "./filter";
import apiFetch from "../../../services/apiFetch";
import { TbSitemapFilled } from "react-icons/tb";
import Pagination from "../../../components/Pagination";
import { RiFilterOffFill } from "react-icons/ri";
import { sortData } from "./data";
import { useAuth } from "../../../context/auth";
import { useModal } from "../../../context/modal";

function InvitroOrders() {
  const [filters, setFilters] = useState({
    tuber: {id: null, name: null},
    sort: null,
    range: null,
    page: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("vitroType") || "group");
  const [isRangeDateOpen, setIsRangeDateOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { vitroOrders, isLoading, 
    loadVitroOrders, setIsLoading, setVitroOrders, vitroOrdersBack } = useAdmin();
  const {user} = useAuth();
  const { vitroModal, setVitroModal } = useModal();

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

  useEffect(() => {
    const fetch = async () => {
      if(!filters.tuber.id && !filters.sort && !filters.range && !filters.page) return setVitroOrders(vitroOrdersBack);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const vitroOrders = await apiFetch(`vitroOrders${params}`);
        setVitroOrders(vitroOrders);
        setIsGetting(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsGetting(false);
      }
    }

    fetch();
  }, [filters, setVitroOrders, vitroOrdersBack, setIsGetting]);

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
          <Title>Invitro</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los pedidos invitro de tu tienda
          </Text>
        </FlexColumn>
        {
          user.role.permissions.includes("INVITRO_CREATE")
          &&
          <Button
            onClick={() => setVitroModal(!vitroModal)}
            fontSize={15}
            Icon={PiPlantFill}
          iconSize={18}
          >
            Nuevo pedido
          </Button>
        }
      </FlexRow>
      <HeaderPage>
        <Tubers
          currentTuber={filters.tuber?.name}
          isBlocked={isSearching}
          setFilters={setFilters}
        />
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Filter 
            localStorageKey="vitroType"
            setType={setType}
            type={type}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            labelSearch="Buscar pedido..."
            onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setVitroOrders, "vitroOrders", vitroOrdersBack, setIsSearching)}
            searchValue={search}
            resetFilters={() => setFilters(filters => ({...filters, tuber: { id: null, name: null }, sort: null, range: null, page: 0 }))}
            reset={() => setSearch("")}
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
              (filters.sort || filters.range || filters.tuber.name)
              && 
              <Button
                onClick={() => setFilters(filters => ({...filters, sort: null, range: null, tuber: {id: null, name: null}, page: 0}))}
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
          : vitroOrders.content?.map((order, index) => (
              <OrderCard
                key={index}
                order={order}
                fullSize={type === "list"}
              />
            ))
        }
      </Section>
      <Pagination
        currentPage={vitroOrders.number}
        totalPages={vitroOrders.totalPages}
        // totalPages={100}
        setFilters={setFilters}
        isLoading={isLoading || isGetting}
      />
      <Modal
        align="start"
        size="md"
        isActive={vitroModal}
        setIsActive={setVitroModal}
      >
        <VitroForm isToCreate />
      </Modal>
    </>
  );
}

export default InvitroOrders;
