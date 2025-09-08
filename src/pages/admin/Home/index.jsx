/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import { Container, Group, Section, TableStyle } from "./styles";
import { Spinner, Table } from "reactstrap";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title as ChartTitle, Tooltip, Legend } from "chart.js";
import { COLORS } from "../../../styles/colors";
import { months } from "../../../data/months";
import { capitalize } from "../../../helpers/capitalize";
import { FlexColumn, Text } from "../../../styles/layout";
import { Card } from "../../../components/Expense/styles";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { useAuth } from "../../../context/auth";
import ActionCard from "../../../components/ActionCard";
import { useModal } from "../../../context/modal";
import { Carousel } from 'primereact/carousel';
import ActionCards from "./ActionCards";
import { FaBoxOpen, FaPlantWilt } from "react-icons/fa6";

Chart.register(
  CategoryScale,
  LinearScale, 
  LineElement, 
  PointElement, 
  ChartTitle, 
  Tooltip, 
  Legend
);

function Home() {
  const { isLoading, setIsLoading, expenses, loadOnHome, homeData } = useAdmin();
  const { setVitroModal, setProductsModal, setOrdersModal, setInvoicesModal, setBannersModal, setClientsModal, setEmployeesModal, setProductsBatchModal } = useModal();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadOnHome();
      }catch(error) {
        setIsLoading(false);
        toast.error(errorParser(error.message));
      }
    }

    fetch();
  }, [setIsLoading, loadOnHome]);

  const data = {
    labels: expenses.map(ex => capitalize(months[ex.month].toLowerCase())),
    datasets: [
      {
        label: "Ingresos",
        data: expenses.map(ex => ex.income),
        borderColor: COLORS.emerald_medium
      },
      {
        label: "Gastos",
        data: expenses.map(ex => ex.totalExpenses),
        borderColor: COLORS.orange_medium
      },
    ]
  }

  const total = expenses.reduce((acc, cur) => ({
    totalExpenses: cur.totalExpenses + acc.totalExpenses,
    totalIncome: cur.income + acc.totalIncome,
    totalProfit: cur.profit + acc.totalProfit
  }), { totalExpenses: 0, totalIncome: 0, totalProfit: 0 });

  const createPermissions = [
    "INVITRO_CREATE",
    "ORDERS_CREATE",
    "PRODUCTS_CREATE",
    "INVOICES_CREATE",
    "WAREHOUSES_CREATE",
    "BANNERS_CREATE",
    "EXPENSES_CREATE",
    "CLIENTS_CREATE",
    "PRODUCTS_BATCH_CREATE"
  ];
  const filteredPermissions = user.role.permissions.filter(p => createPermissions.includes(p));

  return (
    <>
      <FlexColumn gap={0.1}>
        <Title>Hola { capitalize(user.fullName.split(" ")[0].toLowerCase()) }</Title>
        <Text
          style={{marginTop: "-0.5rem"}}
          color={COLORS.dim}
        >
          ¿Qué deseas hacer hoy?
        </Text>
      </FlexColumn>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            {
              filteredPermissions.length <= 5
              ? <ActionCards permissions={filteredPermissions} />
              : <div style={{ width: '100%' }}>
                  <Carousel
                    value={[
                      user.role.permissions.includes("INVITRO_CREATE") && { type: "INVITRO_CREATE", navigateTo: "/invitro", setModal: setVitroModal },
                      user.role.permissions.includes("ORDERS_CREATE") && { type: "ORDERS_CREATE", navigateTo: "/pedidos", setModal: setOrdersModal },
                      user.role.permissions.includes("PRODUCTS_CREATE") && { type: "PRODUCTS_CREATE", navigateTo: "/productos", setModal: setProductsModal },
                      user.role.permissions.includes("INVOICES_CREATE") && { type: "INVOICES_CREATE", navigateTo: "/comprobantes", setModal: setInvoicesModal },
                      user.role.permissions.includes("EMPLOYEES_CREATE") && { type: "EMPLOYEES_CREATE", navigateTo: "/empleados", setModal: setEmployeesModal },
                      user.role.permissions.includes("BANNERS_CREATE") && { type: "BANNERS_CREATE", navigateTo: "/banners", setModal: setBannersModal },
                      user.role.permissions.includes("EXPENSES_CREATE") && { type: "EXPENSES_CREATE", navigateTo: "/gastos", setModal: () => {} },
                      user.role.permissions.includes("CLIENTS_CREATE") && { type: "CLIENTS_CREATE", navigateTo: "/clientes", setModal: setClientsModal },
                      user.role.permissions.includes("PRODUCTS_BATCH_CREATE") && { type: "PRODUCTS_BATCH_CREATE", navigateTo: "/productos", setModal: setProductsBatchModal },
                    ].filter(Boolean)}
                    numVisible={5}
                    numScroll={1}
                    responsiveOptions={[
                      {
                          breakpoint: '1024px',
                          numVisible: 5,
                          numScroll: 1
                      },
                      {
                          breakpoint: '768px',
                          numVisible: 3,
                          numScroll: 1
                      },
                      {
                          breakpoint: '560px',
                          numVisible: 1,
                          numScroll: 1
                      }
                    ]}
                    circular
                    autoplayInterval={3000}
                    itemTemplate={(item) => (
                      <div style={{ padding: '1rem 0.5rem' }}>
                        <ActionCard
                          type={item.type}
                          navigateTo={item.navigateTo}
                          setModal={item.setModal}
                        />
                      </div>
                    )}
                    style={{ width: '100%' }}
                  />
                </div>
            }
            {
              user.role.permissions.includes("PERMISSIONS_WATCH")
              &&
              <Container>
                <Section>
                  <Line
                    data={data}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: "Ingresos y gastos por Mes"
                        }
                      }
                    }}
                  />
                </Section>
                <Group>
                  <Card 
                    size={150}
                    gap={1.5}
                    color={COLORS.orange_medium}
                  >
                    <Text
                      weight={700}
                      size={20}
                      style={{lineHeight: "20px"}}
                    >
                      Gasto total
                    </Text>
                    <Text
                      weight={800}
                      size={25}
                    >
                      S/. { total.totalExpenses?.toFixed(1) }
                    </Text>
                  </Card>
                  <Card
                    size={150}
                    color={COLORS.emerald_medium}
                  >
                    <Text
                      weight={700}
                      size={20}
                      style={{lineHeight: "20px"}}
                    >
                      Ingreso total
                    </Text>
                    <Text
                      weight={800}
                      size={25}
                    >
                      S/. { total.totalIncome?.toFixed(1) }
                    </Text>
                  </Card>
                  <Card
                    size={150}
                    color={COLORS.blue_medium}
                  >
                    <Text
                      weight={700}
                      size={20}
                      style={{lineHeight: "20px"}}
                    >
                      Ganacia total
                    </Text>
                    <Text
                      weight={800}
                      size={25}
                    >
                      S/. { total.totalProfit?.toFixed(1) }
                    </Text>
                  </Card>
                </Group>
              </Container>
            }
            {
              user.role.permissions.includes("INVITRO_WATCH")
              &&
              <Container>
                <Group width={25}>
                  <Card 
                    size={150}
                    color={COLORS.emerald_medium}
                    gap={0.1}
                  >
                    <FlexColumn 
                      gap={0.1}
                      align="center"
                    >
                      <Text
                        weight={900}
                        size={26}
                        style={{lineHeight: "20px"}}
                      >
                        Entregado
                      </Text>
                      <Text
                        weight={500}
                        size={13}
                      >
                        Pedidos entregados
                      </Text>
                    </FlexColumn>
                    <Text
                      weight={800}
                      size={35}
                    >
                      { homeData.vitroOrders.data.ship }
                    </Text>
                  </Card>
                  <Card
                    size={150}
                    color={COLORS.red_medium}
                    gap={0.1}
                  >
                    <FlexColumn 
                      gap={0.1}
                      align="center"
                    >
                      <Text
                        weight={900}
                        size={26}
                        style={{lineHeight: "20px"}}
                      >
                        Pendiente
                      </Text>
                      <Text
                        weight={500}
                        size={13}
                      >
                        Pedidos por entregar
                      </Text>
                    </FlexColumn>
                    <Text
                      weight={800}
                      size={35}
                    >
                      { homeData.vitroOrders.data.pen }
                    </Text>
                  </Card>
                </Group>
                <Section
                  width={75}
                  height="auto"
                  direction="column"
                  justify="flex-start"
                  align="flex-start"
                >
                  <FlexColumn 
                    gap={0.1}
                    style={{alignSelf: "flex-start"}}
                  >
                    <Text
                      size={24}
                      color={COLORS.persian}
                      weight={700}
                      style={{lineHeight: "20px"}}
                    >
                      Plántulas invitro
                    </Text>
                    <Text
                      size={15}
                      color={COLORS.dim}
                    >
                      Resumen de los últimos 5 pedidos invitro
                    </Text>
                  </FlexColumn>
                  {
                    homeData.vitroOrders.content.length > 0
                    ? <Table
                        css={TableStyle}
                        hover
                      >
                        <thead>
                          <tr>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Nombre
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Entrega
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Total
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Fecha Entrega
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Estado
                              </Text>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            homeData.vitroOrders.content?.map((order, index) => {
                              const date = new Date(order.finishDate);
                              const options = {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                timeZone: "UTC"
                              }

                              return (
                                <tr 
                                  key={index}
                                  onClick={() => navigate(`/invitro/${order.id}`)}
                                >
                                  <td>
                                    <Text
                                      size={15}
                                      style={{textTransform: "capitalize", whiteSpace: "nowrap"}}
                                      color={COLORS.dim}
                                    >
                                      { order.client?.rsocial.split(" ").slice(0, 2).join(" ").toLowerCase() }
                                    </Text>
                                  </td>
                                  <td>
                                    <Text
                                      size={15}
                                      color={COLORS.dim}
                                      style={{whiteSpace: "nowrap"}}
                                    >
                                      { order.shippingType === "ENVIO_AGENCIA" ? "Traslado a agencia" : "Recojo en almacén" }
                                    </Text>
                                  </td>
                                  <td>
                                    <Text
                                      size={15}
                                      color={COLORS.persian}
                                      style={{whiteSpace: "nowrap"}}
                                    >
                                      S/. { order.total?.toFixed(2) }
                                    </Text>
                                  </td>
                                  <td>
                                    <Text
                                      size={15}
                                      color={COLORS.dim}
                                      style={{whiteSpace: "nowrap"}}
                                    >
                                      { !order.finishDate ? "Por asignar" : date.toLocaleDateString("es-ES", options) }
                                    </Text>
                                  </td>
                                  <td>
                                    <Badge
                                      color={order.status === "PENDIENTE" ? "warning" : "primary"}
                                    >
                                      { order.status }
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </Table>
                    : <FlexColumn
                        width="100%"
                        style={{padding: "1rem"}}
                        align="center"
                      >
                        <FaPlantWilt 
                          size={28}
                          color={COLORS.persian}
                        />
                        <Text
                          size={18}
                          weight={700}
                          color={COLORS.dim}
                        >
                          Aún no tienes pedidos
                        </Text>
                      </FlexColumn>
                  }
                  <Button 
                    style={{alignSelf: "center", marginTop: homeData.vitroOrders.content.length > 0 ? "1rem" : "0"}}
                    color="secondary"
                    fontSize={15}
                    onClick={() => navigate("/invitro")}
                  >
                    {
                      homeData.vitroOrders.content.length > 0
                      ? "Ver todos"
                      : "Registrar un pedido"
                    }
                  </Button>
                </Section>
              </Container>
            }
            {
              user.role.permissions.includes("ORDERS_WATCH")
              &&
              <Container>
                <Section
                  width={75}
                  height="auto"
                  direction="column"
                  justify="flex-start"
                  align="flex-start"
                >
                  <FlexColumn 
                    gap={0.1}
                    style={{alignSelf: "flex-start"}}
                  >
                    <Text
                      size={24}
                      color={COLORS.persian}
                      weight={700}
                      style={{lineHeight: "20px"}}
                    >
                      Productos
                    </Text>
                    <Text
                      size={15}
                      color={COLORS.dim}
                    >
                      Resumen de los últimos 5 pedidos
                    </Text>
                  </FlexColumn>
                  {
                    homeData.orders.content.length > 0
                    ? <Table
                        css={TableStyle}
                        hover
                      >
                        <thead>
                          <tr>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Nombre
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Entrega
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Total
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Fecha
                              </Text>
                            </th>
                            <th>
                              <Text
                                color={COLORS.gray}
                                weight={600}
                              >
                                Estado
                              </Text>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            homeData.orders.content?.map((order, index) => {
                              const date = new Date(order.date);
                              const options = {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                timeZone: "UTC"
                              }

                              return (
                                <tr 
                                  key={index}
                                  onClick={() => navigate(`/pedidos/${order.id}`)}
                                >
                                  <td>
                                    <Text
                                      size={15}
                                      style={{textTransform: "capitalize", whiteSpace: "nowrap"}}
                                      color={COLORS.dim}
                                    >
                                      { order.client?.rsocial.split(" ").slice(0, 3).join(" ").toLowerCase().replaceAll('"', "") }
                                    </Text>
                                  </td>
                                  <td>
                                    <Text
                                      size={15}
                                      color={COLORS.dim}
                                      style={{whiteSpace: "nowrap"}}
                                    >
                                      { order.shippingType === "ENVIO_AGENCIA" ? "Traslado a agencia" : "Recojo en almacén" }
                                    </Text>
                                  </td>
                                  <td>
                                    <Text
                                      size={15}
                                      color={COLORS.persian}
                                      style={{whiteSpace: "nowrap"}}
                                    >
                                      S/. { order.total?.toFixed(1) }
                                    </Text>
                                  </td>
                                  <td>
                                    <Text
                                      size={15}
                                      color={COLORS.dim}
                                      style={{whiteSpace: "nowrap"}}
                                    >
                                      { date.toLocaleDateString("es-ES", options) }
                                    </Text>
                                  </td>
                                  <td>
                                    <Badge
                                      color={
                                        order.status === "PENDIENTE"
                                        ? "warning"
                                        : order.status === "PAGADO"
                                          ? "blue"
                                          : order.status === "ENVIADO"
                                            ? "orange"
                                            : order.status === "ENTREGADO"
                                              ? "primary"
                                              : "danger"
                                      }
                                    >
                                      { order.status }
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </Table>
                    : <FlexColumn
                        width="100%"
                        style={{padding: "1rem"}}
                        align="center"
                      >
                        <FaBoxOpen 
                          size={28}
                          color={COLORS.persian}
                        />
                        <Text
                          size={18}
                          weight={700}
                          color={COLORS.dim}
                        >
                          Aún no tienes pedidos
                        </Text>
                      </FlexColumn>
                  }
                  <Button 
                    style={{alignSelf: "center", marginTop: homeData.orders.content.length > 0 ? "1rem" : "0"}}
                    color="secondary"
                    fontSize={15}
                    onClick={() => navigate("/pedidos")}
                  >
                    {
                      homeData.orders.content.length > 0
                      ? "Ver todos"
                      : "Registrar un pedido"
                    }
                  </Button>
                </Section>
                <Group width={25}>
                  <Card 
                    size={150}
                    color={COLORS.emerald_medium}
                    gap={0.1}
                  >
                    <FlexColumn 
                      gap={0.1}
                      align="center"
                    >
                      <Text
                        weight={900}
                        size={26}
                        style={{lineHeight: "20px"}}
                      >
                        Entregado
                      </Text>
                      <Text
                        weight={500}
                        size={13}
                      >
                        Pedidos entregados
                      </Text>
                    </FlexColumn>
                    <Text
                      weight={800}
                      size={35}
                    >
                      { homeData.orders.data.ship }
                    </Text>
                  </Card>
                  <Card
                    size={150}
                    color={COLORS.red_medium}
                    gap={0.1}
                  >
                    <FlexColumn 
                      gap={0.1}
                      align="center"
                    >
                      <Text
                        weight={900}
                        size={26}
                        style={{lineHeight: "20px"}}
                      >
                        Pendiente
                      </Text>
                      <Text
                        weight={500}
                        size={13}
                      >
                        Pedidos por entregar
                      </Text>
                    </FlexColumn>
                    <Text
                      weight={800}
                      size={35}
                    >
                      { homeData.orders.data.pen }
                    </Text>
                  </Card>
                </Group>
              </Container>
            }
          </>
      }
    </>
  );
}

export default Home;
