import { useState } from "react";
import { Wrapper } from "../../pages/admin/Product/styles";
import { COLORS } from "../../styles/colors";
import { FlexColumn, Text } from "../../styles/layout";
import { Variety as Container } from "../../pages/admin/InvitroOrder/styles";
import { capitalize } from "../../helpers/capitalize";
import { FaCheck, FaExclamation } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FlexRow } from "../../styles/layout";
import Button from "../Button";
import Badge from "../Badge";
import { TiBackspace } from "react-icons/ti";
import { Spinner } from "reactstrap";
import apiFetch from "../../services/apiFetch";
import toast from "react-hot-toast";

function CancelRequest({ request, setRequests, setIsActive, setOrder }) {
  const [acceptTry, setAccepTry] = useState(0);
  const [rejectTry, setRejectTry] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Lima'
  }
  const parsedDate = new Date(request.createdAt).toLocaleDateString("es-ES", options);

  const handleAccept = async () => {
    if(rejectTry === 1) return setRejectTry(0);

    if(acceptTry === 1) {
      setIsAccepting(true);

      try {
        await apiFetch(`cancel-order/${request.id}/accept`, { method: "PUT" });
        setRequests((requests) => requests.map(req => req.id === request.id ? {...request, accepted: true} : req));
        setIsAccepting(false);
        toast.success("Solicitud aprobada, pedido cancelado");
        setAccepTry(0);
        setIsActive(false);
        setOrder((order) => ({ ...order, status: "CANCELADO", invoice: null }));
      } catch (error) {
        setIsAccepting(false);
        console.error(error);
        toast.error("Error al aprobar la solicitud");
      }

      return;
    }

    setAccepTry(acceptTry + 1);
  }

  const handleReject = async () => {
    if(acceptTry === 1) return setAccepTry(0);

    if(rejectTry === 1) {
      setIsRejecting(true);

      try {
        await apiFetch(`cancel-order/${request.id}/reject`, { method: "PUT" });
        setRequests((requests) => requests.map(req => req.id === request.id ? {...request, rejected: true} : req));
        setIsRejecting(false);
        toast.success("Solicitud rechazada");
        setRejectTry(0);
        setIsActive(false);
      } catch (error) {
        setIsRejecting(false);
        console.error(error);
        toast.error("Error al rechazar la solicitud");
      }

      return;
    }

    setRejectTry(rejectTry + 1);
  }

  return (
    <Container>
      <Wrapper>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Motivo
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { request.reason }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Fecha
          </Text>
          <Text
            weight={600}
            size={14}
            color={COLORS.dim}
          >
            { capitalize(parsedDate) }
          </Text>
        </FlexColumn>
        <FlexColumn gap={0.1}>
          <Text
            weight={700}
            size={15}
          >
            Estado
          </Text>
          <Badge
            color={request.accepted ? "primary" : request.rejected ? "danger" : "warning"}
          >
            {
              request.accepted 
              ? "Aprobado" 
              : request.rejected ? "Rechazado" : "Pendiente"
            }
          </Badge>
        </FlexColumn>
      </Wrapper>
      {
        (!request.accepted && !request.rejected)
        &&
        <FlexRow 
          gap={1}
          style={{flexDirection: rejectTry === 1 ? "row-reverse" : "row"}}
        >
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={15}
            fontSize={14}
            Icon={isAccepting ? null : (acceptTry === 1 ? FaExclamation : rejectTry === 1 ? TiBackspace : FaCheck)}
            onClick={handleAccept}
            disabled={isAccepting || isRejecting}
          >
            {
              isAccepting
              ? <>
                  <Spinner size="sm" />
                  Aceptando...
                </>
              : acceptTry === 1
                ? "Haga click nuevamente para aceptar"
                : rejectTry === 1
                  ? "Cancelar acción"
                  : "Aceptar"
            }
          </Button>
          <Button
            style={{padding: "0.3rem 0.6rem"}}
            iconSize={14}
            fontSize={14}
            Icon={isRejecting ? null : (rejectTry === 1 ? FaExclamation : acceptTry === 1 ? TiBackspace : MdCancel)}
            color="danger"
            onClick={handleReject}
            disabled={isAccepting || isRejecting}
          >
            {
              isRejecting
              ? <>
                  <Spinner size="sm" />
                  Rechazando...
                </>
              : rejectTry === 1
                ? "Haga click nuevamente para rechazar"
                : acceptTry === 1
                  ? "Cancelar acción"
                  : "Rechazar"
            }
          </Button>
        </FlexRow>
      }
    </Container>
  );
}

export default CancelRequest;
