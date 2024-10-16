import { useEffect, useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import Select from "../Input/Select";
import Input from "../Input";
import { formatDate, onDepChange, onDocChange, onDocTypeChange } from "../VitroForm/handlers";
import Button from "../Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";

function OrderForm({ initialValues = {
  documentType: "",
  document: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  city: "",
  date: ""
}, isToCreate, orderId, initialDocType = "", initialDep = "", clientId }) {
  const [currentDep, setCurrentDep] = useState(initialDep);
  const [docType, setDocType] = useState(initialDocType);
  const [isLoading, setIsLoading] = useState(false);
  const { setError, addOrder, updateOrder, departments, provinces, matcher, loadDepartments } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = () => {
      try {
        if(!matcher.departments) loadDepartments();
      }catch(error) {
        setError(error.message);
        console.error(error);
      }
    }
    
    fetch();
  }, [ loadDepartments, matcher.departments, setError ]);

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const now = new Date();
      const department = departments.find(dep => dep.id_ubigeo === values.department).nombre_ubigeo;
      const city = provinces[values.department].find(prov => prov.id_ubigeo === values.city).nombre_ubigeo;

      const clientBody = {
        ...values,
        department,
        city,
        documentType: (values.documentType * 1) === 1 ? "DNI" : "RUC",
        email: values.email ? values.email : `${now.getTime()}@inversiones.com`
      }

      const order = isToCreate ? await addOrder(values, clientBody) : await updateOrder(orderId, values, clientId, clientBody);
      setIsLoading(false);
      navigate(`/admin/pedidos/${order.id}`);
    }catch(error) {
      console.error(error);
      setIsLoading(false);
      setError(error.message);
    }
  }

  const optionsDep = departments.map(department => ({id: department.id_ubigeo, content: department.nombre_ubigeo}));
  const optionsProv = provinces[currentDep]?.map(prov => ({id: prov.id_ubigeo, content: prov.nombre_ubigeo}));
  const today = new Date();
  today.setHours(12);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validate(values, docType)}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue
      }) => (
        <Form onSubmit={handleSubmit}>
          <Title>{ isToCreate ? "Generar pedido" : "Editar pedido" }</Title>
          <Group>
            <Select 
              id="documentType"
              label="Tipo de documento"
              error={errors.documentType}
              touched={touched.documentType}
              value={values.documentType}
              handleBlur={handleBlur}
              handleChange={(e) => onDocTypeChange(e, setFieldValue, setDocType, "documentType")}
              options={[
                {
                  id: 1,
                  content: "DNI"
                },
                {
                  id: 2,
                  content: "RUC"
                }
              ]}
            />
            <Input
              disabled={!docType}
              id="document"
              label="Documento"
              placeholder={docType || "Documento"}
              error={errors.document}
              touched={touched.document}
              value={values.document}
              handleBlur={handleBlur}
              handleChange={(e) => onDocChange(e, setFieldValue, setError, docType)}
            />
          </Group>
          <Group>
            <Input 
              id="firstName"
              label={docType === "RUC" ? "Razón social" : "Nombres"}
              placeholder={docType === "RUC" ? "Razón social" : "Nombres"}
              error={errors.firstName}
              touched={touched.firstName}
              value={values.firstName}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input
              disabled={docType === "RUC"}
              id="lastName"
              label="Apellidos"
              placeholder="Apellidos"
              error={errors.lastName}
              touched={touched.lastName}
              value={values.lastName}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
          <Group>
            <Input 
              id="email"
              label="Correo"
              placeholder="ejm@gmail.com"
              error={errors.email}
              touched={touched.email}
              value={values.email}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input
              id="phone"
              label="Teléfono"
              placeholder="ej. 990849369"
              error={errors.phone}
              touched={touched.phone}
              value={values.phone}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
          <Group>
            <Select
              id="department"
              label="Departamento"
              error={errors.department}
              touched={touched.department}
              value={values.department}
              options={optionsDep}
              handleBlur={handleBlur}
              handleChange={(e) => onDepChange(e, setFieldValue, setCurrentDep)}
            />
            <Select
              disabled={!currentDep}
              id="city"
              label="Ciudad"
              options={optionsProv}
              error={errors.city}
              touched={touched.city}
              value={values.city}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
          <Group width={isToCreate ? 50 : ""}>
            <Input 
              id="date"
              label="Fecha pedido"
              type="date"
              max={formatDate(today)}
              error={errors.date}
              touched={touched.date}
              value={values.date}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            {
              !isToCreate
              &&
              <Select
                id="status"
                label="Estado"
                error={errors.status}
                touched={touched.status}
                value={values.status}
                handleBlur={handleBlur}
                handleChange={handleChange}
                options={[
                  {
                    id: 1,
                    content: "PENDIENTE"
                  },
                  {
                    id: 2,
                    content: "ENTREGADO"
                  },
                  {
                    id: 3,
                    content: "CANCELADO"
                  },
                ]}
              />
            }
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

export default OrderForm;
