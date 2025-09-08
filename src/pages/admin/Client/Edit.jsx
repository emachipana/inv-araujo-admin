import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import apiFetch from "../../../services/apiFetch";
import toast from "react-hot-toast";
import { errorParser } from "../../../helpers/errorParser";
import { Container } from "../Product/styles";
import { validate } from "./validate";
import { Form } from "../../../styles/layout";
import { Group, Title } from "../../../components/ProductForm/styles";
import Select from "../../../components/Input/Select";
import Input from "../../../components/Input";
import { onDocChange, onDocTypeChange } from "../../../components/VitroForm/handlers";
import Button from "../../../components/Button";
import { FaEdit } from "react-icons/fa";
import { useAdmin } from "../../../context/admin";

function EditClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [docType, setDocType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDocLoaded, setIsDocLoaded] = useState(true);
  const [client, setClient] = useState({});
  const { setMatcher } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const client = await apiFetch(`clients/${id}`);
        setClient(client.data);
        setIsLoading(false);
        setDocType(client.data.documentType);
      }catch(error) {
        toast.error(errorParser(error.message));
        setIsLoading(false);
      }
    }

    fetch();
  }, [ id ]);

  const initialValues = {...client};

  const onSubmit = async (values) => {
    try {
      setIsEditing(true);
      const body = {
        phone: values.phone,
        documentType: values.documentType,
        document: values.document,
        rsocial: values.rsocial,
      }

      const client = await apiFetch(`clients/${id}`, {method: "PUT", body});
      setIsEditing(false);
      setMatcher((values) => ({...values, clients: false}));
      navigate(`/clientes/${client.data.id}`);
    }catch(e) {
      setIsEditing(false);
      toast.error(errorParser(e.message));
    }
  }

  return (
    isLoading
    ? <Spinner color="secondary" />
    : <>
        {
          !client.rsocial
          ? <Title>El cliente que quieres editar no existe</Title>
          : <Container>
              <Formik
                initialValues={initialValues}
                validate={(values) => validate(values, docType)}
                onSubmit={onSubmit}
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
                    <Title>Editar cliente</Title>
                    <Group>
                      <Select
                        id="documentType"
                        labelSize={17}
                        label="Tipo de documento"
                        error={errors.documentType}
                        touched={touched.documentType}
                        value={values.documentType}
                        handleBlur={handleBlur}
                        handleChange={(e) => onDocTypeChange(e, setFieldValue, setDocType, "documentType", setIsDocLoaded)}
                        options={[
                          {
                            id: "DNI",
                            content: "DNI"
                          },
                          {
                            id: "RUC",
                            content: "RUC"
                          }
                        ]}
                      />
                      <Input
                        disabled={!docType}
                        labelSize={17}
                        id="document"
                        label="Documento"
                        placeholder={docType || "Documento"}
                        error={errors.document}
                        touched={touched.document}
                        value={values.document}
                        handleBlur={handleBlur}
                        handleChange={(e) => onDocChange(e, setFieldValue, docType, setIsDocLoaded)}
                      />
                    </Group>
                    <Group>
                      <Input
                        labelSize={17}
                        id="rsocial"
                        label="Razón Social"
                        placeholder="ej. Araujo Estrada Yurfa"
                        error={errors.rsocial}
                        touched={touched.rsocial}
                        value={values.rsocial}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        disabled={isDocLoaded}
                      />
                      <Input
                        labelSize={17}
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
                    <Button
                      type="submit"
                      iconSize={18}
                      fontSize={17}
                      size="full"
                      style={{marginTop: "0.7rem"}}
                      disabled={!isValid || isEditing}
                      Icon={FaEdit}
                      color="warning"
                    >
                      {
                        isEditing
                        ? <>
                            <Spinner size="sm" />
                            Editando...
                          </>
                        : "Editar"
                      }
                    </Button>
                  </Form>
                )}
              </Formik>
            </Container>
        }
      </>
  );
}

export default EditClient;
