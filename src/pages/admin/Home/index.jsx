/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import { Container, Group, Section, TableStyle } from "./styles";
import { Spinner, Table } from "reactstrap";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title as ChartTitle, Tooltip, Legend } from "chart.js";
import { COLORS } from "../../../styles/colors";
import AlertError from "../../../components/AlertError";
import { months } from "../../../data/months";
import { capitalize } from "../../../helpers/capitalize";
import { FlexColumn, Text } from "../../../styles/layout";
import { Card } from "../../../components/Expense/styles";
import { useNavigate } from "react-router-dom";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";

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
  const { isLoading, setIsLoading, error, setError, matcher, 
    loadExpenses, expenses, loadVitroOrders, loadOrders,
    vitroOrders, orders } = useAdmin();
    const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        if(!matcher.expenses) await loadExpenses();
        if(!matcher.vitroOrders) await loadVitroOrders();
        if(!matcher.orders) await loadOrders();
        setIsLoading(false);
      }catch(error) {
        console.error(error);
        setIsLoading(false); 
        setError(error.message);
      }
    }

    fetch();
  }, [ loadExpenses, setIsLoading, setError, loadOrders, loadVitroOrders, matcher ]);

  const sortedExpenses = expenses.sort((a, b) => {
    const firstDate = new Date(a.date);
    const secondDate = new Date(b.date);

    return firstDate - secondDate;
  })

  const data = {
    labels: sortedExpenses.map(ex => capitalize(months[ex.month].toLowerCase())),
    datasets: [
      {
        label: "Ingresos",
        data: sortedExpenses.map(ex => ex.income),
        borderColor: COLORS.persian
      },
      {
        label: "Gastos",
        data: sortedExpenses.map(ex => ex.totalExpenses),
        borderColor: COLORS.orange
      },
    ]
  }

  const total = expenses.reduce((acc, cur) => ({
    totalExpenses: cur.totalExpenses + acc.totalExpenses,
    totalIncome: cur.income + acc.totalIncome,
    totalProfit: cur.profit + acc.totalProfit
  }), { totalExpenses: 0, totalIncome: 0, totalProfit: 0 });

  const totalOrders = {
    vitroOrders: {
      ship: vitroOrders.filter(vo => vo.status === "ENTREGADO").length,
      pending: vitroOrders.filter(vo => vo.status === "PENDIENTE").length
    },
    orders: {
      ship: orders.filter(vo => vo.status === "ENTREGADO").length,
      pending: orders.filter(vo => vo.status === "PENDIENTE").length
    }
  }

  return (
    <>
      <Title>Inicio</Title>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
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
                    S/. { total.totalExpenses.toFixed(1) }
                  </Text>
                </Card>
                <Card
                  size={150}
                  color={COLORS.emerald}
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
                    S/. { total.totalIncome.toFixed(1) }
                  </Text>
                </Card>
                <Card
                  size={150}
                  color={COLORS.blue}
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
                    S/. { total.totalProfit.toFixed(1) }
                  </Text>
                </Card>
              </Group>
            </Container>
            <Container>
              <Group width={25}>
                <Card 
                  size={150}
                  color={COLORS.emerald}
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
                    { totalOrders.vitroOrders.ship }
                  </Text>
                </Card>
                <Card
                  size={150}
                  color={COLORS.red}
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
                    { totalOrders.vitroOrders.pending }
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
                    Pedidos
                  </Text>
                </FlexColumn>
                <Table
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
                          Destino
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
                          Entrega
                        </Text>
                      </th>
                      <th>
                        <Text
                          color={COLORS.gray}
                          weight={600}
                        >
                          Variedades
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
                      vitroOrders.slice(0, 5).map((order, index) => {
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
                            onClick={() => navigate(`/admin/invitro/${order.id}`)}
                          >
                            <td>
                              <Text
                                size={15}
                                style={{textTransform: "capitalize", whiteSpace: "nowrap"}}
                                color={COLORS.dim}
                              >
                                { order.client.rsocial.split(" ").slice(0, 2).join(" ").toLowerCase() }
                              </Text>
                            </td>
                            <td>
                              <Text
                                size={15}
                                color={COLORS.dim}
                                style={{whiteSpace: "nowrap"}}
                              >
                                { `${order.city}, ${order.department}` }
                              </Text>
                            </td>
                            <td>
                              <Text
                                size={15}
                                color={COLORS.persian}
                                style={{whiteSpace: "nowrap"}}
                              >
                                S/. { order.total.toFixed(2) }
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
                              <Text
                                size={15}
                                color={COLORS.dim}
                              >
                                { order.items ? order.items?.length : 0 }
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
                <Button 
                  style={{alignSelf: "center", marginTop: "1rem"}}
                  color="secondary"
                  fontSize={16}
                  onClick={() => navigate("/admin/invitro")}
                >
                  Ver todos
                </Button>
              </Section>
            </Container>
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
                    Pedidos
                  </Text>
                </FlexColumn>
                <Table
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
                          Destino
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
                          Entrega
                        </Text>
                      </th>
                      <th>
                        <Text
                          color={COLORS.gray}
                          weight={600}
                        >
                          Productos
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
                      orders.slice(0, 5).map((order, index) => {
                        const date = new Date(order.maxShipDate);
                        const options = {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC"
                        }

                        return (
                          <tr 
                            key={index}
                            onClick={() => navigate(`/admin/pedidos/${order.id}`)}
                          >
                            <td>
                              <Text
                                size={15}
                                style={{textTransform: "capitalize", whiteSpace: "nowrap"}}
                                color={COLORS.dim}
                              >
                                { order.client.rsocial.split(" ").slice(0, 2).join(" ").toLowerCase() }
                              </Text>
                            </td>
                            <td>
                              <Text
                                size={15}
                                color={COLORS.dim}
                                style={{whiteSpace: "nowrap"}}
                              >
                                { `${order.city}, ${order.department}` }
                              </Text>
                            </td>
                            <td>
                              <Text
                                size={15}
                                color={COLORS.persian}
                                style={{whiteSpace: "nowrap"}}
                              >
                                S/. { order.total.toFixed(1) }
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
                              <Text
                                size={15}
                                color={COLORS.dim}
                              >
                                { order.items ? order.items?.length : 0 }
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
                <Button 
                  style={{alignSelf: "center", marginTop: "1rem"}}
                  color="secondary"
                  fontSize={16}
                  onClick={() => navigate("/admin/pedidos")}
                >
                  Ver todos
                </Button>
              </Section>
              <Group width={25}>
                <Card 
                  size={150}
                  color={COLORS.emerald}
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
                    { totalOrders.orders.ship }
                  </Text>
                </Card>
                <Card
                  size={150}
                  color={COLORS.red}
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
                    { totalOrders.orders.pending }
                  </Text>
                </Card>
              </Group>
            </Container>
          </>
      }
      {
        error
        &&
        <AlertError 
          error={error}
          setError={setError}
        />
      }
    </>
  );
}

export default Home;
