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
import { PiMicrosoftExcelLogoBold, PiPlantFill } from "react-icons/pi";
import Button from "../../../components/Button";
import { COLORS } from "../../../styles/colors";
import { HeaderPage, MenuSection } from "./styles";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { FaCalendar, FaEye } from "react-icons/fa6";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { filterBuilder } from "./filter";
import apiFetch from "../../../services/apiFetch";
import { TbSitemapFilled } from "react-icons/tb";
import Pagination from "../../../components/Pagination";
import { RiFilterOffFill } from "react-icons/ri";
import { sortData } from "./data";
import { useAuth } from "../../../context/auth";
import { useModal } from "../../../context/modal";
import ProductionModal from "./ProductionModal";
import { FaSadCry } from "react-icons/fa";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

function InvitroOrders() {
  const [filters, setFilters] = useState({
    tuber: {id: null, name: null},
    sort: null,
    range: null,
    page: 0,
  });
  const [productionModal, setProductionModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(localStorage.getItem("vitroType") || "group");
  const [isRangeDateOpen, setIsRangeDateOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { vitroOrders, isLoading, 
    loadVitroOrders, setIsLoading, setVitroOrders, vitroOrdersBack, productionSummary } = useAdmin();
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

  const exportOrders = async () => {
    try {
      const statusData = {
        "PENDIENTE": "Pendiente",
        "ENVIADO": "Enviado",
        "ENTREGADO": "Entregado",
        "CANCELADO": "Cancelado",
        "PAGADO": "Pagado"
      }

      setIsExporting(true);
      const allOrders = await apiFetch("vitroOrders?size=50&sortby=initDate&direction=DESC");

      const ordersMapped = allOrders.content?.map((order) => {
        const date = new Date(order.initDate);
        const finishDate = order.finishDate ? new Date(order.finishDate) : null;
        const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : null;

        return {
          "Cliente": order.client.rsocial,
          "Documento": order.client.document,
          "Adelanto": order.totalAdvance.toFixed(2),
          "Pendiente": order.pending.toFixed(2),
          "Total": order.total.toFixed(2),
          "Fecha": date.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }),
          "Fecha de entrega": finishDate ? finishDate.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) : "Por asignar",
          "Estado": statusData[order.status] || "PENDIENTE",
          "Destino": order.city ? `${order.city}, ${order.department}` : "Por asignar",
          "Tipo de entrega": order.shippingType === "ENVIO_AGENCIA" ? "Envío por agencia" : "Recojo en almacén",
          "Creado": order.createdBy === "ADMINISTRADOR" ? "Desde el panel" : "Desde la tienda",
          "Entregado el": !deliveryDate ? "Sin entregar" : deliveryDate.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "America/Lima",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          "Termino la producción": order.isReady ? "Sí" : "No",
        }
      });

      const worksheet = utils.json_to_sheet(ordersMapped);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Pedidos");
      
      const excelBuffer = write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {type: "application/octet-stream"});
      const now = new Date();
      const fileName = `pedidos_invitro_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.xlsx`;
      saveAs(data, fileName);

      setIsExporting(false);
    }catch(error) {
      toast.error("Hubo un error al exportar los pedidos");
      setIsExporting(false);
    }
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
          <FlexRow>
            {
              productionSummary?.length > 0
              &&
              <Button
                onClick={() => setProductionModal(true)}
                fontSize={15}
                Icon={FaEye}
                iconSize={18}
                color="secondary"
              >
                Producción pendiente
              </Button>
            }
            {
              vitroOrdersBack?.content?.length > 0
              &&
              <Button
                onClick={exportOrders}
                fontSize={15}
                Icon={isExporting ? null : PiMicrosoftExcelLogoBold}
                iconSize={18}
                color="blue"
                disabled={isExporting}
              >
                {
                  isExporting
                  ? <>
                      <Spinner size="sm" />
                      Exportando...
                    </>
                  : "Exportar pedidos"
                }
              </Button>
            }
            <Button
              onClick={() => setVitroModal(!vitroModal)}
              fontSize={15}
              Icon={PiPlantFill}
              iconSize={18}
            >
              Nuevo pedido
            </Button>
          </FlexRow>
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
          : vitroOrders.content?.length <= 0
            ? <FlexRow
                style={{margin: "1rem"}}
              >
                <FaSadCry />
                <Text
                  size={17}
                  weight={600}
                >
                  No se econtraron pedidos invitro
                </Text>
              </FlexRow>
            : vitroOrders.content?.map((order, index) => (
                <OrderCard
                  key={index}
                  order={order}
                  fullSize={type === "list"}
                  isVitro
                />
              ))
        }
      </Section>
      {
        vitroOrders.content?.length > 0
        &&
        <Pagination
          currentPage={vitroOrders.number}
          totalPages={vitroOrders.totalPages}
          // totalPages={100}
          setFilters={setFilters}
          isLoading={isLoading || isGetting}
        />
      }
      <Modal
        align="start"
        size="md"
        isActive={vitroModal}
        setIsActive={setVitroModal}
      >
        <VitroForm
          setIsActive={setVitroModal}
        />
      </Modal>
      <ProductionModal 
        isActive={productionModal}
        setIsActive={setProductionModal}
      />
    </>
  );
}

export default InvitroOrders;
