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

function Employees() {
  const [createModal, setCreateModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchActive, setSearchActive] = useState(false); 
  const [type, setType] = useState(localStorage.getItem("employeesType") || "group");
  const [searchValue, setSearchValue] = useState(""); 
  const { employees, isLoading, setIsLoading, loadEmployees, setEmployees, employeesBackup } = useAdmin();

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

  return (
    <>
      <Title>Empleados</Title>
      <Filter 
        setModal={setCreateModal}
        textButton="Nuevo empleado"
        localStorageKey="employeesType"
        setType={setType}
        type={type}
        isSearching={searchActive}
        labelSearch="Buscar empleado..."
        onSearchChange={(e) => onSearchChange(e, isSearching, setSearchValue, setIsSearching, setEmployees, "employees", employeesBackup)}
        searchValue={searchValue}
        setIsSearching={setSearchActive}
        setSearch={setSearchValue}
        reset={() => setEmployees(employeesBackup)}
      />
      <Section>
        {
          isLoading || isSearching
          ? <Spinner color="secondary" />
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
