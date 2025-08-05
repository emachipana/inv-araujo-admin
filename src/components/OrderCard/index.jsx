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
import { BsFillPersonVcardFill } from "react-icons/bs";
import { PiInvoiceFill } from "react-icons/pi";
import { IoDocumentText } from "react-icons/io5";
import { FaShippingFast } from "react-icons/fa";

function OrderCard({ order, fullSize = false, isInvoice = false }) {
  const { id, date, initDate, city, department, total, client, maxShipDate, finishDate, shippingType, status, paymentType, serie, address, isSended } = order;
  const { rsocial, document, documentType } = client;
  const destination = [city, department];
  const deliverDate = new Date(maxShipDate || finishDate);
  const initDateParsed = new Date(date || initDate);
  const isVitro = !!initDate;

  const navigate = useNavigate();

  const badgeColor = {
    "PENDIENTE": "warning",
    "CANCELADO": "danger",
    "ENTREGADO": "primary",
    "PAGADO": "orange",
    "BOLETA": "blue",
    "FACTURA": "orange"
  }

  const paymentMessage = {
    "EFECTIVO": "Pagado en efectivo",
    "TARJETA_ONLINE": "Pagado en la web",
    "YAPE": "Pagado por Yape",
    "TRANSFERENCIA": "Transferencia bancaria",
  }

  return (
    <Container 
      onClick={() => navigate(`/${isVitro ? "invitro" : isInvoice ? "comprobantes" : "pedidos"}/${id}`)}
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
                    {
                      isInvoice
                      ? <PiInvoiceFill
                          size={18}
                          color={COLORS.taupe}
                        />
                      : <FaAddressCard
                          size={18}
                          color={COLORS.taupe}
                        />
                    }
                    <Text
                      color={COLORS.taupe}
                      weight={600}
                      notCapitalize
                    >
                      { isInvoice ? `${serie}-${id}` : document }
                    </Text>
                  </FlexRow>
                </FlexColumn>
                <Badge
                  color={badgeColor[status] || "secondary"}
                >
                  { status }
                </Badge>
              </FlexRow>
              <FlexColumn 
                gap={0.1}
                align="flex-end"
              >
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
                    isInvoice
                    ? "Contado"
                    : status === "PAGADO"
                      ? paymentMessage[paymentType]
                      : "Sin pagar"
                  }
                </Text>
              </FlexColumn>
            </RowBetween>
            <RowBetween>
              <FlexColumn align="center">
                <FlexRow>
                  {
                    isInvoice
                    ? <BsFillPersonVcardFill
                        color={COLORS.taupe}
                      />
                    : <FaMapMarkerAlt 
                        color={COLORS.taupe}
                      />
                  }
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    {
                      isInvoice
                      ? documentType
                      : "Entrega"
                    }
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { isInvoice ? document : destination.join(", ") }
                </Text>
              </FlexColumn>
              <FlexColumn align="center">
                <FlexRow>
                  <FaRegCalendarDays 
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    {
                      isInvoice
                      ? "Fecha emisión"
                      : "Fecha pedido"
                    }
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { initDateParsed.toLocaleDateString("es-ES", options) }
                </Text>
              </FlexColumn>
              <FlexColumn align="center">
                <FlexRow>
                  {
                    isInvoice
                    ? <FaMapMarkedAlt
                        color={COLORS.taupe}
                      />
                    : <FaRegCalendarCheck
                        color={COLORS.taupe}
                      />
                  }
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    {
                      isInvoice
                      ? "Dirección"
                      : "Fecha entrega"
                    }
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  {
                    isInvoice
                    ? address
                    : isVitro && !finishDate
                      ? "Por asignar"
                      : deliverDate.toLocaleDateString("es-ES", options)
                  }
                </Text>
              </FlexColumn>
              <FlexColumn align="center">
                <FlexRow>
                  {
                    isInvoice
                    ? <IoDocumentText
                        color={COLORS.taupe}
                      />
                    : <FaMapMarkedAlt
                        color={COLORS.taupe}
                      />
                  }
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    {
                      isInvoice
                      ? "Estado"
                      : "Tipo entrega"
                    }
                  </Text>
                </FlexRow>
                <Badge
                  color={isInvoice ? (isSended ? "primary" : "danger") : shippingType === "RECOJO_ALMACEN" ? "purple" : "blue"}
                >
                  <FlexRow>
                    {
                      isInvoice
                      ? isSended ? "Emitido" : "Sin emitir"
                      : <>
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
                      </>
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
              isVitro={isVitro}
              isInvoice={isInvoice}
            />
            <RowBetween
              style={{padding: "0.5rem 1rem"}}
            >
              <FlexColumn
                align="center"
              >
                <FlexRow>
                  {
                    isInvoice
                    ? <BsFillPersonVcardFill 
                        color={COLORS.taupe}
                      />
                    : <FaShippingFast 
                        color={COLORS.taupe}
                      />
                  }
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    {
                      isInvoice
                      ? documentType
                      : "Entrega"
                    }
                  </Text>
                </FlexRow>
                {
                  isInvoice
                  ? <Text
                      weight={700}
                    >
                      { document }
                    </Text>
                  : <Badge
                      color={isInvoice ? (isSended ? "primary" : "danger") : shippingType === "RECOJO_ALMACEN" ? "purple" : "blue"}
                    >
                      {shippingType === "RECOJO_ALMACEN" ? "Recojo en almacén" : "Envío por agencia"}
                    </Badge>
                }
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
                {
                  isInvoice
                  ? "Tipo"
                  : "Estado"
                }
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
