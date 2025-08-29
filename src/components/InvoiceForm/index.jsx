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
import Button from "../Button";
import { Spinner } from "reactstrap";
import { PiWalletFill } from "react-icons/pi";
import { onDocChange } from "./handlers";
import { errorParser } from "../../helpers/errorParser";
import toast from "react-hot-toast";

function InvoiceForm({ initialValues = {
  invoiceType: "",
  documentType: "",
  rsocial: "",
  document: "",
  issueDate: "",
  address: ""
}, isToCreate, invoiceId, initDocType = "", initInvoiceType = "", isGenerated, setIsActive }) {
  const [docType, setDocType] = useState(initDocType);
  const [invoiceType, setInvoiceType] = useState(initInvoiceType);
  const [isLoading, setIsLoading] = useState(false);
  const { addInvoice, updateInvoice } = useAdmin();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const issueDate = new Date(values.issueDate);

      const body = {
        ...values,
        issueDate: issueDate.toISOString()
      }

      const invoice = isToCreate ? await addInvoice(body) : await updateInvoice(invoiceId, body);
      setIsLoading(false);
      navigate(`/comprobantes/${invoice.id}`);
      if(isToCreate) setIsActive(false);
    }catch(error) {
      setIsLoading(false);
      toast.error(errorParser(error.message));
    }
  }

  const onInvoiceChange = (event, setFieldValue) => {
    const value = event.target.value;
    setFieldValue("invoiceType", value);
    setInvoiceType(value);
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
                  id: "BOLETA",
                  content: "BOLETA"
                },
                {
                  id: "FACTURA",
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
                  id: "DNI",
                  content: "DNI",
                  disabled: invoiceType === "FACTURA"
                },
                {
                  id: "RUC",
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
              handleChange={(e) => onDocChange(e, setFieldValue, docType)}
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
          <Button
            type="submit"
            iconSize={18}
            fontSize={17}
            size="full"
            style={{marginTop: "0.7rem"}}
            disabled={!isValid || isLoading || isGenerated}
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
