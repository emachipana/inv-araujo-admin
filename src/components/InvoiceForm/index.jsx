import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Form } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import { formatDate, onDocTypeChange } from "../VitroForm/handlers";
import { validate } from "./validate";
import Select from "../Input/Select";
import Input from "../Input";
import { getDoc } from "../../services/getByDocument";
import Button from "../Button";
import { Spinner } from "reactstrap";
import { PiWalletFill } from "react-icons/pi";

function InvoiceForm({ initialValues = {
  invoiceType: "",
  documentType: "",
  rsocial: "",
  document: "",
  issueDate: "",
  comment: "",
  address: ""
}, isToCreate, invoiceId, initDocType = "", initInvoiceType = "" }) {
  const [docType, setDocType] = useState(initDocType);
  const [invoiceType, setInvoiceType] = useState(initInvoiceType);
  const [isLoading, setIsLoading] = useState(false);
  const { setError, addInvoice, updateInvoice } = useAdmin();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const body = {
        ...values,
        documentType: (values.documentType * 1) === 1 ? "DNI" : "RUC",
        invoiceType: (values.invoiceType * 1) === 1 ? "BOLETA" : "FACTURA"
      }
      setIsLoading(true);
      const invoice = isToCreate ? await addInvoice(body) : await updateInvoice(invoiceId, body)
      setIsLoading(false);
      navigate(`/admin/comprobantes/${invoice.id}`);
    }catch(error) {
      setIsLoading(false);
      console.error(error);
      setError(error.message);
    }
  }

  const onInvoiceChange = (event, setFieldValue) => {
    const value = event.target.value;
    setFieldValue("invoiceType", value);
    setInvoiceType((value * 1) === 1 ? "BOLETA" : "FACTURA");
  }

  const onDocChange = async (event, setFieldValue, setError) => {
    const value = event.target.value;
    setFieldValue("document", value);
  
    if(!isNaN(value * 1)) {
      if(docType === "RUC" && value.length === 11) {
        const info = await getDoc("ruc", value);
        if(info.razonSocial) {
          setFieldValue("rsocial", info.razonSocial);
          setFieldValue("address", info.direccion);          
          return;
        }
        setError(info.message);
      }
  
      if(docType === "DNI" && value.length === 8) {
        const info = await getDoc("dni", value);
        if(!info.success) return setError(info.message);
        setFieldValue("rsocial", `${info.apellidoPaterno} ${info.apellidoMaterno} ${info.nombres}`);
        setFieldValue("address", "");
      }
    }
  }

  const today = new Date();
  today.setHours(12);
  const after = new Date(today);
  after.setDate(today.getDate() - 2);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validate(values, docType, invoiceType)}
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
          <Title>{ isToCreate ? "Crear comprobante" : "Editar comprobante" }</Title>
          <Group>
            <Select
              id="invoiceType"
              label="Tipo de comprobante"
              error={errors.invoiceType}
              touched={touched.invoiceType}
              value={values.invoiceType}
              handleBlur={handleBlur}
              handleChange={(e) => onInvoiceChange(e, setFieldValue)}
              options={[
                {
                  id: 1,
                  content: "BOLETA"
                },
                {
                  id: 2,
                  content: "FACTURA"
                }
              ]}
            />
            <Select
              disabled={!invoiceType}
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
                  content: "DNI",
                  disabled: invoiceType === "FACTURA"
                },
                {
                  id: 2,
                  content: "RUC"
                }
              ]}
            />
          </Group>
          <Group>
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
            <Input
              disabled={invoiceType === "FACTURA"}
              id="rsocial"
              label="Razón social"
              placeholder="Razón social"
              error={errors.rsocial}
              touched={touched.rsocial}
              value={values.rsocial}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
          <Group>
            <Input
              disabled={invoiceType === "FACTURA" || !invoiceType}
              id="address"
              label="Dirección"
              placeholder="Dirección"
              error={errors.address}
              touched={touched.address}
              value={values.address}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input
              id="issueDate"
              type="date"
              label="Fecha emisión"
              error={errors.issueDate}
              touched={touched.issueDate}
              value={values.issueDate}
              max={formatDate(today)}
              min={formatDate(after)}
              handleBlur={handleBlur}
              handleChange={handleChange}
              onKeyDown={(e) => e.preventDefault()}
            />
          </Group>
          <Input
            id="comment"
            label="Comentario (*opcional)"
            placeholder="Comentario"
            error={errors.comment}
            touched={touched.comment}
            value={values.comment}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
          <Button
            type="submit"
            iconSize={18}
            fontSize={17}
            size="full"
            style={{marginTop: "0.7rem"}}
            disabled={!isValid || isLoading}
            Icon={isLoading ? null : PiWalletFill}
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

export default InvoiceForm;
