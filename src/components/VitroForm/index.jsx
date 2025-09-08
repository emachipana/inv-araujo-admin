import { useEffect, useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { validate } from "./validate";
import { FlexRow, Form, Text } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import Input from "../Input";
import Select from "../Input/Select";
import Button from "../Button";
import { IoIosSad, IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";
import { onDocChange, onDocTypeChange, onSearchChange } from "./handlers";
import Category from "../Category";
import { COLORS } from "../../styles/colors";
import { List, Products } from "../../pages/admin/Order/styles";
import { BiSearch } from "react-icons/bi";
import Client from "./Client";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";
import apiFetch from "../../services/apiFetch";

function VitroForm({ setIsActive }) {
  const [currentAction, setCurrentAction] = useState("Nuevo cliente");
  const [docType, setDocType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
	const [isGetting, setIsGetting] = useState(false);
	const [search, setSearch] = useState("");
	const [searchClients, setSearchClients] = useState({});
	const [clientSelected, setClientSelected] = useState("");
  const [minDate, setMinDate] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isCheckingDate, setIsCheckingDate] = useState(false);
  const [isDocLoaded, setIsDocLoaded] = useState(false);
  const { addVitro, clientsBackup, addClient, loadClients, isLoading: isClientsLoading, setIsLoading: setClientsLoading } = useAdmin();
  const navigate = useNavigate();

  const initialValues = {
    documentType: "",
    document: "",
    rsocial: "",
    phone: "",
    email: "",
    initDate: "",
    finishDate: "",
    quantity: "",
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadClients();

        const filteredClients = {...clientsBackup, content: clientsBackup.content?.filter((client) => client.createdBy === "ADMINISTRADOR")};
        setSearchClients(filteredClients);
      }catch(error) {
        toast.error(errorParser(error.message));
        setClientsLoading(false);
      }
    }
    
    fetch();
  }, [ clientsBackup, loadClients, setClientsLoading ]);

  const calculateMinDate = (qty) => {
    if (!qty || qty < 500) return null;
    const today = new Date();
    const monthsNeeded = Math.max(1, Math.ceil((qty - 1) / 8000));
    const minDate = new Date(today.setMonth(today.getMonth() + monthsNeeded));
    return minDate.toISOString().split('T')[0];
  };

  const onQuantityChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue("quantity", value);
    setQuantity(value);

    if(isNaN(value * 1)) return;
    setMinDate(calculateMinDate(value));
    setFieldValue("finishDate", "");
  }

  const onDateChange = async (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue("finishDate", value);
    setIsCheckingDate(true);

    try {
      const response = await apiFetch(`vitroOrders/availableByMonth?date=${value}&quantity=${quantity}`);
      if(!response.data.isAvailable) {
        setFieldValue("finishDate", "");
        toast.error(response.data.message);
        setIsCheckingDate(false);
        return;
      }

      toast.success(response.data.message);
      setIsCheckingDate(false);
    }catch(e) {
      toast.error(errorParser(e.message));
      setIsCheckingDate(false);
    }
  }

  const onSubmit = async (values) => {
    try {
      if(currentAction === "Cliente registrado" && !clientSelected) return;
      const now = new Date();

      let vitroBody = {
        clientId: clientSelected.id,
        initDate: now.toISOString().split("T")[0],
        finishDate: values.finishDate,
        createdBy: "ADMINISTRADOR"
      }
      
      setIsLoading(true);
      if(currentAction === "Nuevo cliente") {
        const clientBody = {
          ...values,
          documentType: values.documentType,
          email: values.email,
          createdBy: "ADMINISTRADOR",
        }

        const client = await addClient(clientBody);
        vitroBody = {
          ...vitroBody,
          clientId: client.id,
        }
      }

      const vitroOrder = await addVitro(vitroBody);
      setIsLoading(false);
      setIsActive(false);
      navigate(`/invitro/${vitroOrder.id}`);
    }catch(error) {
      toast.error(errorParser(error.message));
      setIsLoading(false);
    }
  }

  const setCurrent = (_id, name) => setCurrentAction(name);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validate(values, docType, currentAction)}
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
          <Title>Registrar pedido</Title>
          <FlexRow gap={1}>
            <Category
              currentCategory={currentAction}
              name="Nuevo cliente"
              setCurrentCategory={setCurrent}
            />
            <Category
              currentCategory={currentAction}
              name="Cliente registrado"
              setCurrentCategory={setCurrent}
            />
          </FlexRow>
          <Text
            align="start"
            style={{alignSelf: "flex-start", marginBottom: "-0.8rem"}}
            size={18.5}
            weight={700}
            color={COLORS.dim}
          >
            Cliente
          </Text>
          {
            currentAction === "Nuevo cliente"
            ? <>
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
                <Group>
                  <Input
                    labelSize={17}
                    id="email"
                    label="Correo"
                    placeholder="@gmail.com"
                    error={errors.email}
                    touched={touched.email}
                    value={values.email}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
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
              </>
            : <>
                <Products>
									<Input
										id="search"
										placeholder="Buscar cliente..."
										Icon={BiSearch}
										value={search}
										style={{width: "60%"}}
                    handleChange={(e) => onSearchChange(e, isGetting, setSearch, setIsGetting, setSearchClients, clientsBackup)}
									/>
									<List
                    height="150px"
                    gap="1rem"
                  >
										{
											isGetting || isClientsLoading
											? <Spinner color="secondary" />
											: (
                          searchClients.content?.length === 0
                          ? <FlexRow>
                              <IoIosSad
                                size={20}
                                color={COLORS.dim}
                              />
                              <Text
                                align="center"
                                size={17}
                                weight={700}
                              >
                                No se encontraron clientes
                              </Text>
                            </FlexRow>
                          : searchClients.content?.map((client, index) => (
                              <Client 
                                id={client.id}
                                rsocial={client.rsocial}
                                document={client.document}
                                documentType={client.documentType}
                                clientSelected={clientSelected}
                                setClientSelected={setClientSelected}
                                key={index}
                                setFieldValue={setFieldValue}
                              />
                            ))
                          )
										}
									</List>
								</Products>
              </>
          }
          <Text
            align="start"
            style={{alignSelf: "flex-start", marginBottom: "-0.8rem"}}
            size={18.5}
            weight={700}
            color={COLORS.dim}
          >
            Pedido
          </Text>
          <Group>
            <Input
              disabled={isCheckingDate}
              labelSize={17}
              id="quantity"
              label="Cantidad total"
              placeholder="Cantidad de plántulas invitro"
              error={errors.quantity}
              touched={touched.quantity}
              value={values.quantity}
              handleBlur={handleBlur}
              handleChange={(e) => onQuantityChange(e, setFieldValue)}
            />
            <Input
              labelSize={17}
              disabled={!quantity || quantity < 500 || isNaN(quantity * 1) || isCheckingDate}
              id="finishDate"
              label="Fecha de entrega"
              type="date"
              min={minDate}
              error={errors.finishDate}
              touched={touched.finishDate}
              value={values.finishDate}
              handleBlur={handleBlur}
              handleChange={(e) => onDateChange(e, setFieldValue)}
            />
          </Group>
          <Button
            type="submit"
            iconSize={18}
            fontSize={17}
            size="full"
            style={{marginTop: "0.7rem"}}
            disabled={!isValid || isLoading || isCheckingDate}
            Icon={isLoading ? null : IoMdAddCircleOutline}
          >
            {
              isLoading
              ? <>
                  <Spinner size="sm" />
                  {
                    "Registrando..."
                  }
                </>
              : "Registrar"
            }
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default VitroForm;
