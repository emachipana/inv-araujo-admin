import { useState } from "react";
import Modal from "../Modal";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../styles/layout";
import { Title } from "../ProductForm/styles";
import Select from "../Input/Select";
import { onDocTypeChange } from "../VitroForm/handlers";
import { onDocChange } from "../InvoiceForm/handlers";
import { useAdmin } from "../../context/admin";
import { PiWalletFill } from "react-icons/pi";
import { Spinner } from "reactstrap";
import Button from "../Button";
import Input from "../Input";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../services/apiFetch";

function InvoiceModal({ isActive, setIsActive, document, documentType, rsocial, address, items, order, updateOrder }) {
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceType, setInvoiceType] = useState("");
  const [docType, setDocType] = useState("");
  const { setError, addInvoice, matcher, setMatcher, setInfo } = useAdmin();
  const navigate = useNavigate();

  const initialValues = {
    invoiceType: "",
    document,
    documentType: documentType === "DNI" ? 1 : 2,
    rsocial,
    address
  }
  
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const now = new Date();
      now.setHours(12);
      const body = {
        ...values,
        documentType: (values.documentType * 1) === 1 ? "DNI" : "RUC",
        invoiceType: (values.invoiceType * 1) === 1 ? "BOLETA" : "FACTURA",
        issueDate: now.toISOString(),
        comment: ""
      }

      const invoice = await addInvoice(body);
      const { id, ...restOrder } = order;
      const orderBody = {
        ...restOrder,
        clientId: restOrder.client?.id,
        docType: restOrder.documentType,
        invoiceId: invoice.id
      }

      await updateOrder(id, orderBody);

      for (let item of items) {
        const body = {
          invoiceId: invoice.id,
          ...item
        }

        await apiFetch("invoiceItems", { body });
      }

      if(matcher.invoices) setMatcher(matcher => ({...matcher, invoices: false}));

      setIsLoading(false);
      navigate(`/comprobantes/${invoice.id}`);
      setInfo(true);
    }catch(error) {
      console.error(error.message);
      setIsLoading(false);
      setError(error.message);
    }
  }

  const onClose = () => {
    setInvoiceType("");
    setIsActive(false);
  }

  const onInvoiceTypeChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue("invoiceType", value);
    const toSave = (value * 1) === 1 ? "BOLETA" : "FACTURA";
    setInvoiceType(toSave);

    if(toSave === "FACTURA" && documentType !== "RUC") {
      setFieldValue("documentType", 2);
      setDocType("RUC");
      setFieldValue("document", "");
      setFieldValue("rsocial", "");
      setFieldValue("address", "");
      return;
    };

    setFieldValue("documentType", documentType === "DNI" ? 1 : 2);
    setDocType(documentType);
    setFieldValue("document", document);
    setFieldValue("rsocial", rsocial);
    setFieldValue("address", address);
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={onClose}
    >
      <Formik
        initialValues={initialValues}
        validate={(values) => validate(values, docType, invoiceType)}
        onSubmit={onSubmit}
      >
        {({
          values,
          touched,
          errors,
          isValid,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>Generar comprobante</Title>
            <Select 
              id="invoiceType"
              label="Tipo de comprobante"
              error={errors.invoiceType}
              touched={touched.invoiceType}
              value={values.invoiceType}
              handleBlur={handleBlur}
              handleChange={(e) => onInvoiceTypeChange(e, setFieldValue)}
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
              disabled={!invoiceType || !(invoiceType === "FACTURA" && documentType !== "RUC")}
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
            <Input
              disabled={!docType || !(invoiceType === "FACTURA" && documentType !== "RUC")}
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
              disabled={invoiceType === "FACTURA" || !(invoiceType === "FACTURA" && documentType !== "RUC")}
              id="rsocial"
              label="Razón social"
              placeholder="Razón social"
              error={errors.rsocial}
              touched={touched.rsocial}
              value={values.rsocial}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input
              disabled={invoiceType === "FACTURA" || !invoiceType || !(invoiceType === "FACTURA" && documentType !== "RUC")}
              id="address"
              label="Dirección"
              placeholder="Dirección"
              error={errors.address}
              touched={touched.address}
              value={values.address}
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
                    Generando...
                  </>
                : "Generar"
              }
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default InvoiceModal;
