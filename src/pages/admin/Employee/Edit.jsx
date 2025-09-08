import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../../../services/apiFetch";
import { toast } from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { Title } from "../../../components/ProductForm/styles";
import { Container } from "../Product/styles";
import EmployeeForm from "../../../components/EmployeeForm";
import { Spinner } from "reactstrap";

function EditEmployee() {
  const [isLoading, setIsLoading] = useState(true);
  const [employee, setEmployee] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        const employee = await apiFetch(`employees/${id}`);
        setEmployee(employee.data);
        setIsLoading(false);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

  console.log(employee?.role?.id);

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !employee.rsocial
          ? <Title>El empleado que quieres editar no existe</Title>
          : <Container
              style={{minWidth: "40%"}}
            >
              <EmployeeForm
                initialValues={{
                  ...employee,
                  roleId: employee?.role?.id,
                }}
                isToCreate={false}
                employeeId={employee.id}
                setIsActive={() => {}}
                isDocLoadedFromProps={true}
              />
            </Container>
        }
      </>
  );
}

export default EditEmployee;
