import { useState } from "react";
import { useAdmin } from "../../context/admin";
// import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../styles/layout";
import Button from "../Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import { Group, Title } from "../ProductForm/styles";
import Input from "../Input";
import { errorParser } from "../../helpers/errorParser";
import { Spinner } from "reactstrap";
import { onDocChange } from "../VitroForm/handlers";
import Select from "../Input/Select";

function EmployeeForm({ initialValues = {
  rsocial: "",
  document: "",
  email: "",
  phone: "",
  roleId: "",
}, isToCreate, employeeId, setIsActive}) {
  const [isLoading, setIsLoading] = useState(false);
  const { addEmployee, updateEmployee, roles } = useAdmin();
  // const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      isToCreate ? await addEmployee(values) : await updateEmployee(employeeId, values);
      setIsLoading(false);
      // navigate(`/empleados/${employee.id}`);
      setIsActive(false);
    }catch(error) {
      setIsLoading(false);
      toast.error(errorParser(error.message));
    }
  }

  const roleOptions = roles.map(role => ({id: role.id, content: role.name}));

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue
      }) => (
        <Form onSubmit={handleSubmit}>
          <Title>{ isToCreate ? "Nuevo empleado" : "Editar empleado" }</Title>
          <Input
            id="document"
            label="DNI"
            placeholder="Ingresa el dni"
            error={errors.document}
            touched={touched.document}
            value={values.document}
            handleChange={(e) => onDocChange(e, setFieldValue, "DNI")}
            handleBlur={(handleBlur)}
          />
          <Input 
            id="rsocial"
            label="Nombres"
            placeholder="Ingresa el nombre completo"
            error={errors.rsocial}
            touched={touched.rsocial}
            value={values.rsocial}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Select 
            id="roleId"
            label="Rol"
            error={errors.roleId}
            touched={touched.roleId}
            handleBlur={handleBlur}
            handleChange={handleChange}
            options={roleOptions}
            value={values.roleId}
          />
          <Group>
            <Input 
              id="email"
              label="Correo"
              placeholder="@correo.com"
              error={errors.email}
              touched={touched.email}
              value={values.email}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <Input 
              id="phone"
              label="Teléfono"
              placeholder="Teléfono de contacto"
              error={errors.phone}
              touched={touched.phone}
              value={values.phone}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </Group>
          <Button
            type="submit"
            iconSize={18}
            fontSize={17}
            size="full"
            style={{marginTop: "0.7rem"}}
            disabled={!isValid || isLoading}
            Icon={isLoading ? null : IoMdAddCircleOutline}
          >
            {
              isLoading
              ? <>
                  <Spinner size="sm" />
                  {
                    isToCreate ? "Agregando..." : "Editando..."
                  }
                </>
              : isToCreate ? "Agregar" : "Editar"
            }
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default EmployeeForm;
