import { FaCheckDouble, FaMapLocation, FaWarehouse } from "react-icons/fa6";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { Variety } from "./styles";
import { GrInProgress } from "react-icons/gr";
import { useState } from "react";
import { Spinner } from "reactstrap";
import toast from "react-hot-toast";
import { MdLocalShipping } from "react-icons/md";
import Badge from "../../../components/Badge";
import { onLocationClick, onStatusClick, updateOrder } from "./handlers";

function OrderStateModal({ isActive, setIsActive, order, setOrder }) {
  const [check, setCheck] = useState(false);
  const [location, setLocation] = useState(false);
  const [status, setStatus] = useState(false);

  const onIsReadyClick = async () => {
    if(order.location === "AGENCIA") return toast.error("No puedes volder a producción si el pedido ya está en la agencia");
    if(order.status === "ENTREGADO") return toast.error("No puedes volver a producción si el pedido ya se entregó");
    setCheck(true);

    try {
      const orderBody = {
        isReady: !order.isReady,
      }

      await updateOrder(orderBody, "vitroOrders", setOrder, order);
      setCheck(false);
    }catch(error) {
      toast.error(error.message);
      setCheck(false);
    }
  }

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
        <FlexRow style={{width: "100%", flexWrap: "wrap"}}>
          <Variety>
            <FlexRow>
              <Text
                weight={700}
                size={17}
              >
                { 
                  order.isReady ? "Terminado" : "En producción"
                }
              </Text>
              {
                order.isReady
                ? <FaCheckDouble />
                : <GrInProgress />
              }
            </FlexRow>
            <Button
              fontSize={14}
              iconSize={13}
              Icon={check ? null : (order.isReady ? GrInProgress : FaCheckDouble)}
              onClick={onIsReadyClick}
              color={order.isReady ? "warning" : "primary"}
            >
              {
                check
                ? <>
                    <Spinner 
                      size="sm"
                    />
                    {" "}
                    Marcando...
                  </>
                : order.isReady
                  ? "Volver a producción"
                  : "Marcar como terminado" 
              }
            </Button>
          </Variety>
          {
            order.isReady
            &&
            <>
              { 
                order.status === "PENDIENTE"
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
                        onClick={() => onLocationClick(order, "vitroOrders", setOrder, setLocation)}
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
                    onClick={() => onStatusClick(order, "vitroOrders", setOrder, setStatus)}
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
            </>
          }
        </FlexRow>
      </FlexColumn>
    </Modal>
  );
}

export default OrderStateModal;
