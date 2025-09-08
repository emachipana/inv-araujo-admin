import { useEffect, useState } from "react";
import { Container, Image } from "./styles";
import apiFetch from "../../services/apiFetch";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";
import { Spinner } from "reactstrap";
import { FlexColumn, FlexRow, Text } from "../../styles/layout";
import { capitalizeAll } from "../../helpers/capitalize";
import { FaAddressCard, FaIdCard, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { COLORS } from "../../styles/colors";
import { IoDocumentText } from "react-icons/io5";
import Badge from "../Badge";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function ClientCard({ client, fullSize }) {
  const [user, setUser] = useState({});
  const [isGetting, setIsGetting] = useState(false);
  const { id, userId, rsocial, documentType, document, consumption, phone, email, invoiceDetail, createdBy } = client;
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        if(userId) {
          setIsGetting(true);
          const user = await apiFetch(`users/${userId}`);
          setUser(user.data);
          setIsGetting(false);
        }
      }catch(error) {
        toast.error(errorParser(error.message));
      }
    }

    fetch();
  }, [userId]);

  return (
    <Container
      fullSize={fullSize}
      onClick={() => navigate(`/clientes/${id}`)}
    >
      {
        fullSize
        ? <>
            <FlexRow
              width="100%"
              justify="space-between"
            >
              <FlexRow>
                <Image
                  alt="user-profile"
                  src={user.image ? user.image.url : "/img/user_default.jpg"}
                />
                <FlexColumn
                  gap={0.1}
                >
                  <Text
                    weight={700}
                    size={17}
                    align="center"
                  >
                    { capitalizeAll(rsocial.toLowerCase()) }
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
              </FlexRow>
              <FlexColumn
                style={{gap: 0}}
                align="center"
              >
                <Text
                  size={15}
                  color={COLORS.taupe}
                >
                  Consumo total
                </Text>
                <Text
                  size={17}
                  color={COLORS.persian}
                  weight={700}
                >
                  S/. { consumption.toFixed(2) }
                </Text>
              </FlexColumn>
            </FlexRow>
            <FlexRow
              width="100%"
              justify="space-between"
              style={{padding: "0 1rem"}}
            >
              <FlexColumn
                align="center"
                gap={0.1}
              >
                <FlexRow>
                  <FaPhone
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Teléfono
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { phone || "Sin teléfono"}
                </Text>
              </FlexColumn>
              <FlexColumn
                align="center"
                gap={0.1}
              >
                <FlexRow>
                  <MdEmail 
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Correo
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { email }
                </Text>
              </FlexColumn>
              <FlexColumn
                align="center"
                gap={0.1}
              >
                <FlexRow>
                  <IoDocumentText 
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Comprobante
                  </Text>
                </FlexRow>
                <Text
                  weight={700}
                >
                  { invoiceDetail ? invoiceDetail.invoicePreference : "Sin especificar" }
                </Text>
              </FlexColumn>
              <FlexColumn
                gap={0.1}
                align="center"
              >
                <FlexRow>
                  <FaUser
                    color={COLORS.taupe}
                  />
                  <Text
                    color={COLORS.taupe}
                    weight={600}
                  >
                    Creado por
                  </Text>
                </FlexRow>
                <Badge
                  size={14}
                  color={createdBy === "CLIENTE" ? "purple" : "blue"}
                >
                  { capitalizeAll(createdBy.toLowerCase()) }
                </Badge>
              </FlexColumn>
            </FlexRow>
          </>
        : <>
            <FlexColumn
              align="center"
              gap={0.2}
            >
              {
                isGetting
                ? <Spinner 
                    size="sm"
                    color="secondary"
                  />
                : <Image 
                    alt="user-profile"
                    src={user.image ? user.image.url : "/img/user_default.jpg"}
                  />
              }
              <Text
                weight={700}
                size={17}
                align="center"
              >
                { capitalizeAll(rsocial.toLowerCase()) }
              </Text>
              <FlexRow>
                <FaIdCard 
                  size={14}
                  color={COLORS.taupe}
                />
                <Text
                  size={14}
                  color={COLORS.taupe}
                >
                  { documentType }: { document }
                </Text>
              </FlexRow>
            </FlexColumn>
            <FlexColumn
              style={{gap: 0}}
              align="center"
            >
              <Text
                size={14}
                color={COLORS.taupe}
              >
                Consumo total
              </Text>
              <Text
                size={17}
                color={COLORS.persian}
                weight={700}
              >
                S/. { consumption.toFixed(2) }
              </Text>
            </FlexColumn>
          </>
      }
    </Container>
  );
}

export default ClientCard;
