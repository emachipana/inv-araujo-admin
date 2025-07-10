import { useEffect, useState } from "react";
import Filter from "../../../components/Filter";
import { Title } from "../styles";
import Type from "./Type";
import { Section } from "../Products/styles";
import { useAdmin } from "../../../context/admin";
import { Spinner } from "reactstrap";
import List from "./List";
import Invoice from "../../../components/OrderCard/Invoice";
import Modal from "../../../components/Modal";
import InvoiceForm from "../../../components/InvoiceForm";
import { onSearchChange } from "../Products/handlers";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { FaFileInvoice } from "react-icons/fa6";
import Button from "../../../components/Button";
import { HeaderPage, MenuSection } from "../InvitroOrders/styles";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { TbSitemapFilled } from "react-icons/tb";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { filterBuilder } from "./filter";
import apiFetch from "../../../services/apiFetch";
import { sortData } from "../InvitroOrders/data";
import Pagination from "../../../components/Pagination";
import { RiFilterOffFill } from "react-icons/ri";
import { useModal } from "../../../context/modal";
import { useAuth } from "../../../context/auth";

function Invoices() {
  const [filters, setFilters] = useState({
    invoiceType: {id: null, name: null},
    sort: null,
    page: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [type, setType] = useState(localStorage.getItem("invoiceType") || "group");
  const { isLoading, setIsLoading, loadInvoices, invoices, setInvoices, invoicesBackup } = useAdmin();
  const { invoicesModal: createModal, setInvoicesModal: setCreateModal } = useModal();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadInvoices();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadInvoices, setIsLoading ]);

  useEffect(() => {
    const fetch = async () => {
      if(!filters.invoiceType.id && !filters.sort && !filters.page) return setInvoices(invoicesBackup);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const invoices = await apiFetch(`invoices${params}`);
        setInvoices(invoices);
        setIsGetting(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsGetting(false);
      }
    }

    fetch();
  }, [ filters, invoicesBackup, setInvoices, setIsGetting ]);
  
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
          <Title>Comprobantes</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los comprobantes de tu tienda
          </Text>
        </FlexColumn>
        {
          user.role.permissions.includes("INVOICES_CREATE")
          &&
          <Button
            onClick={() => setCreateModal(!createModal)}
            fontSize={15}
            Icon={FaFileInvoice}
            iconSize={18}
          >
            Nuevo comprobante
          </Button>
        }
      </FlexRow>
      <HeaderPage>
        <Type 
          currentType={filters.invoiceType?.name}
          isBlocked={isSearching}
          setFilters={setFilters}
        />
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Filter 
            localStorageKey="invoiceType"
            setType={setType}
            type={type}
            isSearching={isSearching}
            labelSearch="Buscar comprobante..."
            onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setInvoices, "invoices", invoicesBackup, setIsSearching)}
            searchValue={search}
            setIsSearching={setIsSearching}
            resetFilters={() => setFilters(filters => ({...filters, invoiceType: {id: null, name: null}, sort: null, page: 0 }))}
            reset={() => setSearch("")}
          />
          <FlexRow gap={1}>
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
              (filters.sort || filters.invoiceType.name)
              && 
              <Button
                onClick={() => setFilters(filters => ({...filters, sort: null, invoiceType: {id: null, name: null}, page: 0}))}
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
          : (type === "group"
              ? invoices.content?.map((invoice, index) => (
                  <Invoice 
                    key={index}
                    id={invoice.id}
                    rsocial={invoice.rsocial}
                    date={invoice.issueDate}
                    type={invoice.invoiceType}
                    document={invoice.document}
                    total={invoice.total}
                  />
                ))
              : <List />
            )
        }
      </Section>
      <Pagination 
        currentPage={invoices.number}
        totalPages={invoices.totalPages}
        // totalPages={7}
        setFilters={setFilters}
        isLoading={isLoading || isGetting}
      />
      <Modal
        size="md"
        isActive={createModal}
        setIsActive={setCreateModal}
      >
        <InvoiceForm isToCreate />
      </Modal>
    </>
  );
}

export default Invoices;
