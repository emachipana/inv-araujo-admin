import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import Input from "../Input";
import Select from "../Input/Select";
import Button from "../Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";
import { onDocChange, onDocTypeChange } from "./handlers";

function VitroForm({ initialValues = {
  docType: "",
  document: "",
  firstName: "",
  lastName: "",
  phone: "",
  destination: "",
  advance: "",
  initDate: "",
  finishDate: ""
}, isToCreate, vitroId, initialDocType = "" }) {
  const [docType, setDocType] = useState(initialDocType);
  const [isLoading, setIsLoading] = useState(false);
  const { setError, addVitro, updateVitro } = useAdmin();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const body = {
        ...values,
        advance: values.advance || 0,
        docType: (values.docType * 1) === 1 ? "DNI" : "RUC",
        status: (values.status * 1) === 1 ? "PENDIENTE" : ((values.status * 1) === 2 ? "ENTREGADO" : "CANCELADO")
      }
      setIsLoading(true);
      const vitroOrder = isToCreate ? await addVitro(body) : await updateVitro(vitroId, body);
      setIsLoading(false);
      navigate(`/admin/invitro/${vitroOrder.id}`);
    }catch(error) {
      setIsLoading(false);
      console.error(error);
      setError(error.message);
    }
  }

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
              id="docType"
              label="Tipo de documento"
              error={errors.docType}
              touched={touched.docType}
              value={values.docType}
              handleBlur={handleBlur}
              handleChange={(e) => onDocTypeChange(e, setFieldValue, setDocType, "docType")}
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
              id="phone"
              label="Teléfono"
              placeholder="ej. 990849369"
              error={errors.phone}
              touched={touched.phone}
              value={values.phone}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input
              id="destination"
              label="Destino"
              placeholder="ej. Cusco"
              error={errors.destination}
              touched={touched.destination}
              value={values.destination}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
          <Group>
            <Input
              id="initDate"
              label="Fecha inicio"
              type="date"
              error={errors.initDate}
              touched={touched.initDate}
              value={values.initDate}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input
              id="finishDate"
              label="Fecha fin"
              type="date"
              error={errors.finishDate}
              touched={touched.finishDate}
              value={values.finishDate}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
          {
            !isToCreate
            &&
            <Group>
              <Input
                id="advance"
                label="Adelanto"
                placeholder="S/. 0.0"
                error={errors.advance}
                touched={touched.advance}
                value={values.advance}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
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
            </Group>
          }
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

export default VitroForm;