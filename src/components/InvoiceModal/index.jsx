import { useState } from "react";
import Modal from "../Modal";
import { Formik } from "formik";
import { validate } from "./validate";
import { Form } from "../../styles/layout";
import { Title } from "../ProductForm/styles";
import Select from "../Input/Select";
import { onDocTypeChange } from "../VitroForm/handlers";
import { onDocChange } from "../InvoiceForm/handlers";
import { PiWalletFill } from "react-icons/pi";
import { Spinner } from "reactstrap";
import Button from "../Button";
import Input from "../Input";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../services/apiFetch";
import toast from "react-hot-toast";

function InvoiceModal({ isActive, setIsActive, invoiceDetail, isAbleToEdit, clientId, orderId, type = "order" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [invoicePreference, setInvoicePreference] = useState(invoiceDetail.invoicePreference);
  const [docType, setDocType] = useState(invoiceDetail.documentType);
  const [isDocLoaded, setIsDocLoaded] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    invoicePreference: invoiceDetail.invoicePreference,
    document: invoiceDetail.document,
    documentType: invoiceDetail.documentType,
    rsocial: invoiceDetail.rsocial,
    address: invoiceDetail.address
  }
  
  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const body = {
        ...values
      }

      if(!invoiceDetail.invoicePreference) {
        await apiFetch(`clients/${clientId}/invoiceDetails`, { body, method: "POST" });
      }else if(invoiceDetail.invoicePreference) {
        await apiFetch(`clients/${clientId}/invoiceDetails/${invoiceDetail.id}`, { body, method: "PUT" });
      }

      const response = await apiFetch(`${type === "order" ? "orders" : "vitroOrders"}/${orderId}/generate-invoice`, { method: "POST" });
      navigate(`/comprobantes/${response.data.invoiceId}`);
      setIsLoading(false);
      setIsActive(false);
    }catch(error) {
      setIsLoading(false);
      toast.error("Hubo un error vuelve a intentalo");
    }
  }

  const onClose = () => {
    setInvoicePreference("");
    setIsActive(false);
  }

  const onInvoiceTypeChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue("invoicePreference", value);
    setInvoicePreference(value);

    setFieldValue("documentType", "");
    setDocType("");
    setFieldValue("document", "");
    setFieldValue("rsocial", "");
    setFieldValue("address", "");

    if(value === "FACTURA") {
      setFieldValue("documentType", "RUC");
      setDocType("RUC");
    }
  }

  return (
    <Modal
      isActive={isActive}
      setIsActive={onClose}
    >
      <Formik
        initialValues={initialValues}
        validate={(values) => validate(values, docType, invoicePreference)}
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
              disabled={!isAbleToEdit}
              id="invoicePreference"
              label="Tipo de comprobante"
              error={errors.invoicePreference}
              touched={touched.invoicePreference}
              value={values.invoicePreference}
              handleBlur={handleBlur}
              handleChange={(e) => onInvoiceTypeChange(e, setFieldValue)}
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
              disabled={!invoicePreference || !isAbleToEdit}
              id="documentType"
              label="Tipo de documento"
              error={errors.documentType}
              touched={touched.documentType}
              value={values.documentType}
              handleBlur={handleBlur}
              handleChange={(e) => onDocTypeChange(e, setFieldValue, setDocType, "documentType", setIsDocLoaded)}
              options={[
                {
                  id: "DNI",
                  content: "DNI",
                  disabled: invoicePreference === "FACTURA"
                },
                {
                  id: "RUC",
                  content: "RUC"
                }
              ]}
            />
            <Input
              disabled={!docType || !isAbleToEdit}
              id="document"
              label="Documento"
              placeholder={docType || "Documento"}
              error={errors.document}
              touched={touched.document}
              value={values.document}
              handleBlur={handleBlur}
              handleChange={(e) => onDocChange(e, setFieldValue, docType, setIsDocLoaded)}
            />
            <Input
              id="rsocial"
              label="Razón social"
              placeholder="Razón social"
              error={errors.rsocial}
              touched={touched.rsocial}
              value={values.rsocial}
              handleBlur={handleBlur}
              handleChange={handleChange}
              disabled={isDocLoaded || !isAbleToEdit}
            />
            <Input
              id="address"
              label="Dirección"
              placeholder="Dirección"
              error={errors.address}
              touched={touched.address}
              value={values.address}
              handleBlur={handleBlur}
              handleChange={handleChange}
              disabled={(isDocLoaded && invoicePreference === "FACTURA") || !isAbleToEdit}
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
