import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import { Section } from "../Products/styles";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import apiFetch from "../../../services/apiFetch";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { HeaderPage, MenuSection } from "../InvitroOrders/styles";
import Filter from "../../../components/Filter";
import { onSearchChange } from "../Products/handlers";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { TbSitemapFilled } from "react-icons/tb";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { filterBuilder } from "./filter";
import Pagination from "../../../components/Pagination";
import ClientCard from "../../../components/ClientCard";
import { Spinner } from "reactstrap";
import Button from "../../../components/Button";
import { RiFilterOffFill } from "react-icons/ri";
import { FaSadCry } from "react-icons/fa";

function Clients() {
  const [filters, setFilters] = useState({
    sort: null,
    page: 0
  });
  const [search, setSearch] = useState("");
  const [isGetting, setIsGetting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { isLoading, setIsLoading, loadClients, clients, setClients, clientsBackup } = useAdmin();
  const [type, setType] = useState(localStorage.getItem("clientType") || "group");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadClients();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadClients, setIsLoading ]);

  useEffect(() => {
    const fetch = async () => {
      if(!filters.sort && !filters.page) return setClients(clientsBackup);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const clients = await apiFetch(`clients${params}`);
        setClients(clients);
        setIsGetting(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsGetting(false);
      }
    }

    fetch();
  }, [filters, setClients, clientsBackup, setIsGetting]);

  const sortData = {
    "NEW_TO_OLD": "Reciente a antiguo",
    "OLD_TO_NEW": "Antiguo a reciente",
    "HIGHEST_CONSUMPTION": "Mayor consumo a menor",
    "LOWEST_CONSUMPTION": "Menor consumo a mayor"
  }

  const onClickSort = (name) => {
    if(filters.sort === name) return;

    setFilters({...filters, sort: name, page: 0});
    setIsSortOpen(false);
  }

  return (
    <>
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <FlexColumn gap={0.1}>
          <Title>Clientes</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los clientes de tu tienda
          </Text>
        </FlexColumn>
      </FlexRow>
      <HeaderPage>
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Filter
            localStorageKey="clientType"
            setType={setType}
            type={type}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            labelSearch="Buscar cliente..."
            onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setClients, "clients", clientsBackup, setIsSearching)}
            searchValue={search}
            resetFilters={() => setFilters(filters => ({...filters, sort: null, page: 0 }))}
            reset={() => setSearch("")}
          />
          <FlexRow>
            <DropDown
              Button={SelectButton}
              buttonData={{
                Icon: TbSitemapFilled,
                children: sortData[filters.sort] || "Ordernar por",
                isActive: !!filters.sort,
              }}
              isOpen={isSortOpen}
              setIsOpen={setIsSortOpen}
            >
              <MenuSection>
                <SelectItem
                  minWidth={195}
                  onClick={() => onClickSort("NEW_TO_OLD")}
                  isActive={filters.sort === "NEW_TO_OLD"}
                >
                  Reciente a antiguo
                </SelectItem>
                <SelectItem
                  minWidth={195}
                  onClick={() => onClickSort("OLD_TO_NEW")}
                  isActive={filters.sort === "OLD_TO_NEW"}
                >
                  Antiguo a reciente
                </SelectItem>
                <SelectItem
                  minWidth={195}
                  onClick={() => onClickSort("HIGHEST_CONSUMPTION")}
                  isActive={filters.sort === "HIGHEST_CONSUMPTION"}
                >
                  Mayor consumo a menor
                </SelectItem>
                <SelectItem
                  minWidth={195}
                  onClick={() => onClickSort("LOWEST_CONSUMPTION")}
                  isActive={filters.sort === "LOWEST_CONSUMPTION"}
                  >
                  Menor consumo a mayor
                </SelectItem>
              </MenuSection>
            </DropDown>
            {
              filters.sort
              && 
              <Button
                onClick={() => setFilters(filters => ({...filters, sort: null, page: 0}))}
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
          : clients.content?.length <= 0
            ? <FlexRow
                style={{margin: "1rem"}}
              >
                <FaSadCry />
                <Text
                  size={17}
                  weight={600}
                >
                  No se econtraron clientes
                </Text>
              </FlexRow>
            : clients.content?.map((client, index) => (
                <ClientCard 
                  key={index}
                  client={client}
                  fullSize={type === "list"}
                />
              ))
          }
      </Section>
      {
        clients.content?.length > 0
        &&
        <Pagination 
          currentPage={clients.number}
          totalPages={clients.totalPages}
          // totalPages={5}
          setFilters={setFilters}
          isLoading={isLoading || isGetting}
        />
      }
    </>
  );
}

export default Clients;
