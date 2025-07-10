import { useNavigate } from "react-router-dom";
import { FlexColumn, FlexRow } from "../../styles/layout";
import Badge from "../Badge";
import { Bottom, Container, RowBetween, Text } from "./styles";
import Header from "./Header";
import { FaMapMarkerAlt, FaAddressCard, FaMapMarkedAlt } from "react-icons/fa";
import { FaBuildingWheat, FaMoneyBills, FaRegCalendarCheck, FaRegCalendarDays } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { COLORS } from "../../styles/colors";
import { options } from "./util";

function OrderCard({ order, fullSize = false }) {
  const { id, date, initDate, city, department, total, client, maxShipDate, finishDate, shippingType, status, paymentType } = order;
  const { rsocial, document } = client;
  const destination = [city, department];
  const deliverDate = new Date(maxShipDate || finishDate);
  const initDateParsed = new Date(date || initDate);
  const isVitro = !!initDate;

  const navigate = useNavigate();

  const badgeColor = {
    "PENDIENTE": "warning",
    "CANCELADO": "danger",
    "ENTREGADO": "primary",
    "PAGADO": "orange"
  }

  const paymentMessage = {
    "EFECTIVO": "Pagado en efectivo",
    "TARJETA_ONLINE": "Pagado en la web",
    "YAPE": "Pagado por Yape",
    "TRANSFERENCIA": "Transferencia bancaria",
  }

  return (
    <Container 
      onClick={() => navigate(`/${isVitro ? "invitro" : "pedidos"}/${id}`)}
      fullSize={fullSize}
    >
      {
        fullSize
        ? <>
            <RowBetween
              style={{marginBottom: "1rem"}}
            >
              <FlexRow
                width="60%"
                justify="flex-start"
                gap={.5}
                align="flex-start"
              >
                <FlexColumn 
                  gap={0.1}
                >
                  <Text
                    size="18px"
                  >
                    { rsocial.replaceAll('"', "").toLowerCase() }
                  </Text>
                  <FlexRow>
                    <FaAddressCard 
                      size={18}
                      color={COLORS.taupe}
                    />
                    <Text
                      color={COLORS.taupe}
                      weight={600}
                      notCapitalize
                    >
                      { document }
                    </Text>
                  </FlexRow>
                </FlexColumn>
                <Badge
                  color={badgeColor[status] || "secondary"}
                >
                  { status }
                </Badge>
              </FlexRow>
              <FlexColumn gap={0.1}>
                <Text
                  size="18px"
                  weight={700}
                >
                  S/. { total.toFixed(2) }
                </Text>
                <Text
                  color={COLORS.taupe}
                  weight={600}
                  notCapitalize
                >
                  {
                    status === "PAGADO"
                    ? paymentMessage[paymentType]
                    : "Sin pagar"
                  }
                </Text>
              </FlexColumn>
            </RowBetween>
            <RowBetween>
              <FlexColumn>
                <FlexRow>
                  <FaMapMarkerAlt 
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Destino
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { destination.join(", ") }
                </Text>
              </FlexColumn>
              <FlexColumn>
                <FlexRow>
                  <FaRegCalendarDays 
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Fecha pedido
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { initDateParsed.toLocaleDateString("es-ES", options) }
                </Text>
              </FlexColumn>
              <FlexColumn>
                <FlexRow>
                  <FaRegCalendarCheck
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Fecha entrega
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  {
                    isVitro && !finishDate
                    ? "Por asignar"
                    : deliverDate.toLocaleDateString("es-ES", options)
                  }
                </Text>
              </FlexColumn>
              <FlexColumn>
                <FlexRow>
                  <FaMapMarkedAlt
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Tipo entrega
                  </Text>
                </FlexRow>
                <Badge
                  color={shippingType === "RECOJO_ALMACEN" ? "purple" : "blue"}
                >
                  <FlexRow>
                    { 
                      shippingType === "ENVIO_AGENCIA"
                      ? <MdLocalShipping
                          size={15} 
                        />
                      : <FaBuildingWheat
                          size={15}
                        />
                    }
                    { 
                      shippingType === "RECOJO_ALMACEN"
                      ? "Recojo en almacén"
                      : "Envío por agencia"
                    }
                  </FlexRow>
                </Badge>
              </FlexColumn>
            </RowBetween>
          </>
        : <>
            <Header 
              name={ rsocial.replaceAll('"', "")}
              date={date}
            />
            <RowBetween
              style={{padding: "0.5rem 1rem"}}
            >
              <FlexColumn
                align="center"
              >
                <FlexRow>
                  <FaMapMarkerAlt 
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Destino
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { destination[0] }
                </Text>
              </FlexColumn>
              <FlexColumn
                align="center"
              >
                <FlexRow>
                  <FaMoneyBills 
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Total
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  S/. { total.toFixed(2) }
                </Text>
              </FlexColumn>
            </RowBetween>
            <Bottom>
              <Text
                color={COLORS.dim}
              >
                Estado
              </Text>
              <Badge
                color={badgeColor[status] || "secondary"}
              >
                { status }
              </Badge>
            </Bottom>   
          </>
      }
    </Container>
  );
}

export default OrderCard;
