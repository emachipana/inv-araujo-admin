import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { toast } from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { Spinner } from "reactstrap";
import { Card, Section, Wrapper } from "../Product/styles";
import { FlexColumn, Text } from "../../../styles/layout";
import { Title } from "../styles";
import { COLORS } from "../../../styles/colors";
import { capitalize, capitalizeAll } from "../../../helpers/capitalize";
import Button from "../../../components/Button";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Variety } from "../InvitroOrder/styles";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function Employee() {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState({});
  const [operations, setOperations] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const employee = await apiFetch(`employees/${id}`);
        const operations = await apiFetch(`employees/operations/${id * 1}`);
        setEmployee(employee.data);
        setOperations(operations);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    } 

    fetch();
  }, [ id ]);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !employee.id
          ? <Title>El empleado no existe</Title>
          : <>
              <Title>{ capitalizeAll(employee.rsocial.toLowerCase()) }</Title>
              <Section>
                <Card>
                  <Wrapper>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        DNI
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { employee.document }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Correo
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { employee.email }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Teléfono
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { employee.phone }
                      </Text>
                    </FlexColumn>
                    <FlexColumn gap={0.3}>
                      <Text
                        weight={700}
                      >
                        Cargo
                      </Text>
                      <Text
                        weight={600}
                        size={15}
                        color={COLORS.dim}
                      >
                        { employee.role.name }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper 
                    isButtons
                    justify="space-evenly"
                  >
                    <Button
                      Icon={FaEdit}
                      fontSize={15}
                      iconSize={18}
                      color="warning"
                      onClick={() => navigate("edit")}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => {}}
                      Icon={FaTrashAlt}
                      fontSize={15}
                      iconSize={16}
                      color="danger"
                    >
                      Eliminar
                    </Button>
                  </Wrapper>
                </Card>
                <Card position="first">
                  <FlexColumn>
                    <Text
                      weight={700}
                      size={17}
                    >
                      Operaciones
                    </Text>
                    <FlexColumn
                      width="100%"
                      gap={1}
                    >
                      {
                        operations.map((operation, index) => {
                          const timeAgo = operation.createdAt ? formatDistanceToNow(new Date(operation.createdAt), { 
                            addSuffix: true,
                            locale: es
                          }) : '';

                          return (
                            <Variety
                              key={index}
                              gap={0.5}
                              radius="0.75rem"
                              align="center"
                            >
                              <Text
                                color={COLORS.blue}
                                weight={500}
                                isLink
                                onClick={() => navigate(`${operation.redirectTo}`)}
                              >
                                { operation.operation }
                              </Text>
                              <Text
                                size={13}
                                color={COLORS.dim}
                              >
                                { capitalize(timeAgo) }
                              </Text>
                            </Variety>
                          );
                        })
                      }
                    </FlexColumn>
                  </FlexColumn>
                </Card>
              </Section>
            </>
        }
      </>
  );
}

export default Employee;
