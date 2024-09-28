import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import Select from "../Input/Select";
import Input from "../Input";
import { onDocChange, onDocTypeChange } from "../VitroForm/handlers";
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
  city: "",
  date: "",
  shipType: "",
  payType: ""
}, isToCreate, orderId, initialDocType = "" }) {
  const [docType, setDocType] = useState(initialDocType);
  const [isLoading, setIsLoading] = useState(false);
  const { setError, addOrder, updateOrder } = useAdmin();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const order = isToCreate ? await addOrder(values) : await updateOrder(orderId, values);
      setIsLoading(false);
      navigate(`/admin/pedidos/${order.id}`);
    }catch(error) {
      console.error(error);
      setIsLoading(false);
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
              id="shipType"
              label="Tipo de envío"
              error={errors.shipType}
              touched={touched.shipType}
              value={values.shipType}
              handleBlur={handleBlur}
              handleChange={handleChange}
              options={[
                {
                  id: 1,
                  content: "EXPRESS"
                },
                {
                  id: 2,
                  content: "NORMAL"
                }
              ]}
            />
            <Select 
              id="payType"
              label="Tipo de pago"
              error={errors.payType}
              touched={touched.payType}
              value={values.payType}
              handleBlur={handleBlur}
              handleChange={handleChange}
              options={[
                {
                  id: 1,
                  content: "DEPOSITO"
                },
                {
                  id: 2,
                  content: "TARJETA"
                }
              ]}
            />
          </Group>
          <Group>
            <Input 
              id="city"
              label="Ciudad"
              placeholder="ej. Huancayo"
              error={errors.city}
              touched={touched.city}
              value={values.city}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input 
              id="date"
              label="Fecha pedido"
              type="date"
              error={errors.date}
              touched={touched.date}
              value={values.date}
              handleBlur={handleBlur}
              handleChange={handleChange}
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

export default OrderForm;
