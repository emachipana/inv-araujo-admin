import { useEffect, useState } from "react";
import Filter from "../../../components/Filter";
import { Title } from "../styles";
import { useAdmin } from "../../../context/admin";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { Section } from "../Products/styles";
import { Spinner } from "reactstrap";
import List from "./List";
import Modal from "../../../components/Modal";
import EmployeeCard from "../../../components/EmployeeCard";
import EmployeeForm from "../../../components/EmployeeForm";
import { onSearchChange } from "../Products/handlers";
import { FlexColumn, FlexRow, Text } from "../../../styles/layout";
import { COLORS } from "../../../styles/colors";
import Button from "../../../components/Button";
import { IoIosPersonAdd } from "react-icons/io";
import { HeaderPage, MenuSection } from "../InvitroOrders/styles";
import DropDown from "../../../components/DropDown";
import SelectButton from "../../../components/SelectButton";
import { TbSitemapFilled } from "react-icons/tb";
import SelectItem from "../../../components/SelectButton/SelectItem";
import { filterBuilder } from "./filter";
import apiFetch from "../../../services/apiFetch";
import { useModal } from "../../../context/modal";
import { useAuth } from "../../../context/auth";
import Roles from "../../../components/Roles";
import { FaSadCry } from "react-icons/fa";

function Employees() {
  const [filters, setFilters] = useState({
    sort: null,
    role: {id: null, name: null}
  });
  const [search, setSearch] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);
  const [isGetting, setIsGetting] = useState(false); 
  const [type, setType] = useState(localStorage.getItem("employeesType") || "group");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { employees, isLoading, setIsLoading, loadEmployees, setEmployees, employeesBackup } = useAdmin();
  const { employeesModal: createModal, setEmployeesModal: setCreateModal } = useModal();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadEmployees();
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [loadEmployees, setIsLoading]);

  useEffect(() => {
    const fetch = async () => {
      if(!filters.sort && !filters.role.id) return setEmployees(employeesBackup);

      try {
        setIsGetting(true);
        const params = filterBuilder(filters);
        const employees = await apiFetch(`employees${params}`);
        setEmployees(employees);
        setIsGetting(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsGetting(false);
      }
    }

    fetch();
  }, [filters, setEmployees, employeesBackup, setIsGetting]);

  return (
    <>
      <FlexRow
        width="100%"
        justify="space-between"
      >
        <FlexColumn>
          <Title>Empleados</Title>
          <Text
            style={{marginTop: "-0.5rem"}}
            color={COLORS.dim}
          >
            Gestiona todos los empleados de tu tienda
          </Text>
        </FlexColumn>
        {
          user.role.permissions.includes("EMPLOYEES_CREATE")
          &&
          <Button
            onClick={() => setCreateModal(!createModal)}
            fontSize={15}
            Icon={IoIosPersonAdd}
            iconSize={18}
          >
            Nuevo empleado
          </Button>
        }
      </FlexRow>
      <HeaderPage>
        <Roles 
          isBlocked={isSearching}
          currentRole={filters.role?.name}
          setFilters={setFilters}
        />
        <FlexRow
          width="100%"
          justify="space-between"
        >
          <Filter 
            localStorageKey="employeesType"
            setType={setType}
            type={type}
            isSearching={isSearching}
            labelSearch="Buscar empleado..."
            onSearchChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setEmployees, "employees", employeesBackup, setIsSearching)}
            searchValue={search}
            setIsSearching={setIsSearching}
            resetFilters={() => setFilters(filters => ({...filters, sort: null }))}
            reset={() => setSearch("")}
          />
          <DropDown
            Button={SelectButton}
            buttonData={{
              Icon: TbSitemapFilled,
              children: "Ordernar por",
            }}
            isOpen={isSortOpen}
            setIsOpen={setIsSortOpen}
          >
            <MenuSection>
              <SelectItem
                minWidth={195}
              >
                Reciente a antiguo
              </SelectItem>
              <SelectItem
                minWidth={195}
              >
                Antiguo a reciente
              </SelectItem>
              <SelectItem
                minWidth={195}
              >
                Mayor consumo a menor
              </SelectItem>
              <SelectItem
                minWidth={195}
              >
                Menor consumo a mayor
              </SelectItem>
            </MenuSection>
          </DropDown>
        </FlexRow>
      </HeaderPage>
      <Section>
        {
          isLoading || isGetting
          ? <Spinner color="secondary" />
          : employees.length <= 0
            ? <FlexRow
                style={{margin: "1rem"}}
              >
                <FaSadCry />
                <Text
                  size={17}
                  weight={600}
                >
                  No se econtraron empleados
                </Text>
              </FlexRow>
            : (type === "group"
                ? employees.map((employee, index) => (
                  <EmployeeCard 
                    key={index}
                    employee={employee}
                  />
                ))
                : <List />
              )
        }
      </Section>
      <Modal
        isActive={createModal}
        setIsActive={setCreateModal}
      >
        <EmployeeForm 
          isToCreate 
          setIsActive={setCreateModal}
        />
      </Modal>
    </>
  );
}

export default Employees;
