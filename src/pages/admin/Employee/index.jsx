import { useEffect, useState, useMemo } from "react";
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
import { FaEdit, FaTrashAlt, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Variety } from "../InvitroOrder/styles";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageButton, PaginationContainer, PaginationContent } from "./styles";
import DeleteModal from "../Product/DeleteModal";
import { useAdmin } from "../../../context/admin";

function Employee() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [employee, setEmployee] = useState({});
  const [operations, setOperations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setMatcher } = useAdmin();

  useEffect(() => {
    const fetch = async () => {
      try {
        const employee = await apiFetch(`employees/${id}`);
        const operations = await apiFetch(`employees/operations/${id * 1}`);
        setEmployee(employee.data);
        setOperations(operations?.reverse());
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    } 

    fetch();
  }, [ id ]);

  // Calculate pagination
  const totalPages = Math.ceil(operations.length / itemsPerPage);
  
  // Get current operations
  const currentOperations = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return operations.slice(indexOfFirstItem, indexOfLastItem);
  }, [operations, currentPage, itemsPerPage]);

  // Go to previous page
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Go to next page
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const deleteEmployee = async () => {
    console.log(employee.id);
    await apiFetch(`employees/${employee.id}`, { method: "DELETE" });
    setMatcher((values) => ({ ...values, employees: false }));
  }

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !employee.id
          ? <Title>El empleado no existe</Title>
          : <>
              <Title>{ capitalizeAll(employee.rsocial?.toLowerCase() || '') }</Title>
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
                        { employee.role?.name || '' }
                      </Text>
                    </FlexColumn>
                  </Wrapper>
                  <Wrapper 
                    isButtons
                    justify="space-evenly"
                  >
                    <Button
                      Icon={FaEdit}
                      fontSize={14}
                      iconSize={15}
                      color="warning"
                      onClick={() => navigate("edit")}
                    >
                      Editar datos
                    </Button>
                    {
                      operations.length <= 0
                      &&
                      <Button
                        onClick={() => setDeleteModal(true)}
                        Icon={FaTrashAlt}
                        fontSize={14}
                        iconSize={15}
                        color="danger"
                      >
                        Eliminar empleado
                      </Button>
                    }
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
                        currentOperations.length > 0
                        ? currentOperations.map((operation, index) => {
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
                        : <Text
                            size={15}
                            weight={600}
                            color={COLORS.dim}
                          >
                            No hay operaciones
                          </Text>
                      }
                    </FlexColumn>
                    
                    {operations.length > itemsPerPage && (
                      <PaginationContainer>
                        <PaginationContent>
                          <PageButton
                            onClick={goToPreviousPage} 
                            disabled={currentPage === 1}
                            aria-label="Página anterior"
                          >
                            <FaAngleLeft />
                          </PageButton>
                          
                          <Text size={14} weight={500} color={COLORS.dim}>
                            Página {currentPage} de {totalPages}
                          </Text>
                          
                          <PageButton 
                            onClick={goToNextPage} 
                            disabled={currentPage === totalPages}
                            aria-label="Siguiente página"
                          >
                            <FaAngleRight />
                          </PageButton>
                        </PaginationContent>
                      </PaginationContainer>
                    )}
                  </FlexColumn>
                </Card>
              </Section>
              <DeleteModal
                id={employee.id}
                isActive={deleteModal}
                setIsActive={setDeleteModal}
                handleDelete={deleteEmployee}
                navTo="empleados"
                title="¿Eliminar empleado?"
              />
            </>
        }
      </>
  );
}

export default Employee;
