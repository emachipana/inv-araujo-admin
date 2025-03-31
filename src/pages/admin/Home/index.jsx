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
  const navigate = useNavigate();

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
        borderColor: COLORS.persian
      },
      {
        label: "Gastos",
        data: expenses.map(ex => ex.totalExpenses),
        borderColor: COLORS.orange
      },
    ]
  }

  const total = expenses.reduce((acc, cur) => ({
    totalExpenses: cur.totalExpenses + acc.totalExpenses,
    totalIncome: cur.income + acc.totalIncome,
    totalProfit: cur.profit + acc.totalProfit
  }), { totalExpenses: 0, totalIncome: 0, totalProfit: 0 });

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
                    S/. { total.totalExpenses?.toFixed(1) }
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
                    S/. { total.totalIncome?.toFixed(1) }
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
                    S/. { total.totalProfit?.toFixed(1) }
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
                    { homeData.vitroOrders.data.ship }
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
                          Fecha entrega
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
                <Button 
                  style={{alignSelf: "center", marginTop: "1rem"}}
                  color="secondary"
                  fontSize={16}
                  onClick={() => navigate("/invitro")}
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
                          Fecha entrega
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
                            onClick={() => navigate(`/pedidos/${order.id}`)}
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
                  onClick={() => navigate("/pedidos")}
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
                    { homeData.orders.data.ship }
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
                    { homeData.orders.data.pen }
                  </Text>
                </Card>
              </Group>
            </Container>
          </>
      }
    </>
  );
}

export default Home;
