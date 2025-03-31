/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useAdmin } from "../../../context/admin";
import { Title } from "../styles";
import { Container, Section } from "../Products/styles";
import { Spinner, Table } from "reactstrap";
import { Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import { TextDescription } from "../../../components/Product/styles";
import { Container as Filter } from "../../../components/Filter/styles";
import Input from "../../../components/Input";
import { BiSearch } from "react-icons/bi";
import apiFetch from "../../../services/apiFetch";
import { errorParser } from "../../../helpers/errorParser";
import toast from "react-hot-toast";

function Clients() {
  const [search, setSearch] = useState("");
  const [isGetting, setIsGetting] = useState(false);
  const { isLoading, setIsLoading, loadClients, clients, setClients, clientsBackup } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadClients();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ loadClients, setIsLoading ]);

  const onSearchChange = async (e) => {
    const value = e.target.value;

    try {
      if(isGetting) return;
      setSearch(value);

      if(value.length >= 3) {
        setIsGetting(true);
        const searchedClients = await apiFetch(`clients/search?param=${value}`);
        setClients(searchedClients);
        setIsGetting(false);
        return;
      }

      setClients(clientsBackup);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsGetting(false);
    }
  }

  return (
    <>
      <Title>Clientes</Title>
      <Section>
        {
          isLoading
          ? <Spinner color="secondary" />
          : <>
              <Filter style={{padding: "0 1rem"}}>
                <Input
                  id="search"
                  value={search}
                  Icon={BiSearch}
                  placeholder="Buscar cliente..."
                  style={{maxWidth: "280px", alignSelf: "flex-end"}}
                  backgroundColor="white"
                  handleChange={onSearchChange}
                />
              </Filter>
              {
                isGetting
                ? <Spinner color="secondary" />
                : <Table
                    css={Container}
                    responsive
                    hover
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>
                          <Text
                            align="start"
                            weight={600}
                            color={COLORS.gray}
                          >
                            Nombre
                          </Text>
                        </th>
                        <th>
                          <Text
                            align="start"
                            weight={600}
                            color={COLORS.gray}
                          >
                            Documento
                          </Text>
                        </th>
                        <th>
                          <Text
                            align="start"
                            weight={600}
                            color={COLORS.gray}
                          >
                            Teléfono
                          </Text>
                        </th>
                        <th>
                          <Text
                            weight={600}
                            color={COLORS.gray}
                          >
                            Envío
                          </Text>
                        </th>
                        <th>
                          <Text
                            align="start"
                            weight={600}
                            color={COLORS.gray}
                          >
                            Consumo
                          </Text>
                        </th>
                        <th>
                          <Text
                            align="start"
                            weight={600}
                            color={COLORS.gray}
                            style={{whiteSpace: "nowrap"}}
                          >
                            Pedidos
                          </Text>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {    
                        clients.content?.map((client, index) => {
                          const orders = (client.vitroOrders ? client.vitroOrders.length : 0) + (client.orders ? client.orders.length : 0);

                          return (
                            <tr key={index}>
                              <td>
                                <Text
                                  size={15}
                                  weight={500}
                                  color={COLORS.dim}
                                >
                                  { index + 1 }
                                </Text>
                              </td>
                              <td>
                                <TextDescription
                                  width={300}
                                  lines={1}
                                  height="18px"
                                  size={15}
                                  color={COLORS.dim}
                                  style={{textTransform: "capitalize"}}
                                >
                                  {client.rsocial.toLowerCase()}
                                </TextDescription>
                              </td>
                              <td>
                                <Text
                                  size={15}
                                  weight={500}
                                  color={COLORS.dim}
                                >
                                  { client.document }
                                </Text>
                              </td>
                              <td>
                                <Text
                                  size={15}
                                  weight={500}
                                  color={COLORS.dim}
                                >
                                  { client.phone }
                                </Text>
                              </td>
                              <td>
                                <Text
                                  size={15}
                                  weight={500}
                                  color={COLORS.dim}
                                >
                                  { `${client.city}, ${client.department}` }
                                </Text>
                              </td>
                              <td>
                                <Text
                                  size={15}
                                  weight={500}
                                  color={COLORS.persian}
                                >
                                  S/. { client.consumption }
                                </Text>
                              </td>
                              <td>
                                <Text
                                  size={15}
                                  weight={500}
                                  color={COLORS.dim}
                                >
                                  { orders }
                                </Text>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </Table>
              }
              
            </>
        }
      </Section>
    </>
  );
}

export default Clients;
