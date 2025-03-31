import { useState } from "react";
import { Variety } from "../InvitroOrder/styles";
import { onLocationClick, onStatusClick } from "../InvitroOrder/handlers";
import Modal from "../../../components/Modal";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { FaCheckDouble, FaMapLocation, FaWarehouse } from "react-icons/fa6";
import Button from "../../../components/Button";
import { MdLocalShipping } from "react-icons/md";
import { Spinner } from "reactstrap";
import Badge from "../../../components/Badge";
import { GrInProgress } from "react-icons/gr";

function OrderStateModal({isActive, setIsActive, order, setOrder}) {
  const [location, setLocation] = useState(false);
  const [status, setStatus] = useState(false);

  return (
    <Modal
      isActive={isActive}
      setIsActive={setIsActive}
    >
      <FlexColumn>
        <Text
          weight={700}
          size={18}
        >
          Estado del pedido
        </Text>
        {
          (order.status === "PENDIENTE" || order.shippingType === "ENVIO_AGENCIA")
          &&
          <Variety>
            <FlexRow>
              <Text
                weight={700}
                size={17}
              >
                {
                  order.location === "ALMACEN"
                  ? "Pedido en almacén"
                  : "Pedido en agencia"
                }
              </Text>
            </FlexRow>
            {
              order.shippingType === "RECOJO_ALMACEN"
              ? <FlexRow>
                  <FaMapLocation
                    size={18}
                  />
                  <Text
                    style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    size={16}
                  >
                    Sapallanga - Jr. San Bernardo 520
                  </Text>
                </FlexRow>
              : <Button
                  fontSize={14}
                  iconSize={13}
                  Icon={location ? null : (order.location === "AGENCIA" ? FaWarehouse : MdLocalShipping)}
                  onClick={() => onLocationClick(order, "orders", setOrder, setLocation)}
                  color={order.location === "AGENCIA" ? "warning" : "primary"}
                >
                  {
                    location
                    ? <>
                        <Spinner
                          size="sm"
                        />
                        {" "}
                        Marcando...
                      </>
                    : order.location === "AGENCIA"
                      ? "Marcar en almacén"
                      : "Marcar en agencia" 
                  }
                </Button>
            }
          </Variety>
        }
        {
          ((order.shippingType === "ENVIO_AGENCIA" && order.location === "AGENCIA") || order.shippingType === "RECOJO_ALMACEN")
          &&
          <Variety>
          <FlexRow>
            <Text
              weight={700}
              size={17}
            >
              Pedido
            </Text>
            <Badge color={
              order.status === "PENDIENTE" ? "warning" : (order.status === "ENTREGADO" ? "primary" : "danger")
            }>
              { order.status }
            </Badge>
          </FlexRow>
            <Button
              fontSize={14}
              iconSize={13}
              Icon={status ? null : (order.status === "PENDIENTE" ? FaCheckDouble : GrInProgress)}
              onClick={() => onStatusClick(order, "orders", setOrder, setStatus)}
              color={order.status === "PENDIENTE" ? "primary" : "warning"}
            >
              {
                status
                ? <>
                    <Spinner 
                      size="sm"
                    />
                    {" "}
                    Marcando...
                  </>
                : order.status === "PENDIENTE"
                  ? "Marcar como entregado"
                  : "Marcar como pendiente" 
              }
            </Button>
          </Variety>
        }
      </FlexColumn>
    </Modal>
  );
}

export default OrderStateModal;
