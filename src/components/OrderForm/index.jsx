import { useEffect, useState } from "react";
import { useAdmin } from "../../context/admin";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { FlexRow, Form, Text } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import Select from "../Input/Select";
import Input from "../Input";
import { onDepChange, onDocChange, onDocTypeChange, onSearchChange } from "../VitroForm/handlers";
import Button from "../Button";
import { IoMdAddCircleOutline, IoIosSad } from "react-icons/io";
import { Spinner } from "reactstrap";
import Category from "../Category";
import Client from "../VitroForm/Client";
import { List, Products } from "../../pages/admin/Order/styles";
import { BiSearch } from "react-icons/bi";
import { COLORS } from "../../styles/colors";
import { validate } from "./validate";
import { errorParser } from "../../helpers/errorParser";
import toast from "react-hot-toast";
import { departments, provinces } from "../../data/places";
import ShippingType from "./ShippingType";
import apiFetch from "../../services/apiFetch";

function OrderForm({ setIsActive }) {
  const [currentAction, setCurrentAction] = useState("Nuevo cliente");
  const [currentDep, setCurrentDep] = useState("");
  const [docType, setDocType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [search, setSearch] = useState("");
  const [searchClients, setSearchClients] = useState({});
  const [clientSelected, setClientSelected] = useState({});
  const [shippingType, setShippingType] = useState(null);
  const [pickupHours, setPickupHours] = useState([]);
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  const { addOrder, loadClients, addClient, isLoading: isClientsLoading, clientsBackup, setIsLoading: setClientsLoading } = useAdmin();
  const navigate = useNavigate();

  const initialValues = {
    documentType: "",
    document: "",
    rsocial: "",
    email: "",
    phone: "",
    department: "",
    city: "",
    shippingType: "",
    pickupDate: "",
    pickupHour: "",
  }

  const setCurrent = (_id, name) => setCurrentAction(name); 

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadClients();

        const filteredClients = {...clientsBackup, content: clientsBackup.content?.filter((client) => client.createdBy === "ADMINISTRADOR")};
        setSearchClients(filteredClients);
      }catch(error) {
        setIsLoading(false);
        toast.error(errorParser(error.message));
        setClientsLoading(false);
      }
    }
    
    fetch();
  }, [ loadClients, clientsBackup, setClientsLoading ]);

  const onSubmit = async (values) => {
    try {
      if(currentAction === "Cliente registrado" && !clientSelected) return;
      const now = new Date();
      
      const receiverInfo = {
        fullName: clientSelected.rsocial,
        document: clientSelected.document,
        phone: clientSelected.phone
      }

      const pickupInfo = {
        date: values.pickupDate,
        hour: values.pickupHour
      }

      let orderBody = {
        clientId: clientSelected.id,
        department: shippingType === "RECOJO_ALMACEN" ? "Junin" : departments.find(dep => dep.id_ubigeo === values.department).nombre_ubigeo,
        city: shippingType === "RECOJO_ALMACEN" ? "Huancayo" : provinces[values.department].find(prov => prov.id_ubigeo === values.city).nombre_ubigeo,
        date: now.toISOString().split("T")[0],
        shippingType: values.shippingType,
        createdBy: "ADMINISTRADOR",
        receiverInfo: shippingType === "ENVIO_AGENCIA" ? receiverInfo : null,
        pickupInfo: shippingType === "RECOJO_ALMACEN" ? pickupInfo : null,
        warehouseId: shippingType === "RECOJO_ALMACEN" ? 1 : null
      }

      setIsLoading(true);
      if(currentAction === "Nuevo cliente") {
        const clientBody = {
          ...values,
          documentType: values.documentType,
          email: values.email,
          createdBy: "ADMINISTRADOR"
        }

        const client = await addClient(clientBody);
        if(shippingType === "ENVIO_AGENCIA") {
          receiverInfo.document = client.document;
          receiverInfo.phone = client.phone;
          receiverInfo.fullName = client.rsocial;
        }

        orderBody = {
          ...orderBody,
          clientId: client.id,
          receiverInfo: shippingType === "ENVIO_AGENCIA" ? receiverInfo : null
        }
      }

      const order = await addOrder(orderBody);
      setIsLoading(false);
      setIsActive(false);
      navigate(`/pedidos/${order.id}`);
    }catch(error) {
      setIsLoading(false);
      toast.error(errorParser(error.message));
    }
  }

  const optionsDep = departments.map(department => ({id: department.id_ubigeo, content: department.nombre_ubigeo}));
  const optionsProv = provinces[currentDep]?.map(prov => ({id: prov.id_ubigeo, content: prov.nombre_ubigeo}));
  
  const formatTimeTo12h = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleDateChange = async (e, setFieldValue) => {
    const selectedDate = e.target.value;
    setFieldValue('pickupDate', selectedDate);
    setFieldValue('pickupHour', '');
    
    try {
      setIsLoadingHours(true);
      const response = await apiFetch(`orders/availableHours?date=${selectedDate}`);
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;
      
      const today = now.toISOString().split('T')[0];
      const hours = selectedDate === today 
        ? response.data.hours.filter(hour => hour > currentTime)
        : response.data.hours;
      
      const formattedHours = hours.map(hour => ({
        id: hour,
        content: formatTimeTo12h(hour)
      }));
      
      setPickupHours(formattedHours);
    } catch (error) {
      console.error('Error fetching available hours:', error);
      toast.error('Error al cargar las horas disponibles');
      setPickupHours([]);
    } finally {
      setIsLoadingHours(false);
    }
  };
  
  const getMinDate = () => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();
    
    if (currentHour > 17 || (currentHour === 17 && currentMinutes >= 30)) {
      today.setDate(today.getDate() + 1);
    }
    
    return today.toISOString().split('T')[0];
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={(values) => validate(values, docType, currentAction, shippingType)}
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
                    handleChange={(e) => onDocTypeChange(e, setFieldValue, setDocType, "documentType")}
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
                    handleChange={(e) => onDocChange(e, setFieldValue, docType)}
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
                                phone={client.phone || "No especificado"}
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
          <ShippingType
            shipType={shippingType}
            setShipType={setShippingType}
            setFieldValue={setFieldValue}
          />
          {
            shippingType === "ENVIO_AGENCIA"
            &&
            <>
              <Text
                align="start"
                style={{alignSelf: "flex-start", marginBottom: "-0.8rem"}}
                size={18.5}
                weight={700}
                color={COLORS.dim}
              >
                Destino
              </Text>
              <Group>
                <Select
                  labelSize={17}
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
                  labelSize={17}
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
            </>
          }
          {
            shippingType === "RECOJO_ALMACEN"
            &&
            <>
              <Text
                align="start"
                style={{alignSelf: "flex-start", marginBottom: "-0.8rem"}}
                size={18.5}
                weight={700}
                color={COLORS.dim}
              >
                Fecha de recojo
              </Text>
              <Group>
                <Input
                  labelSize={17}
                  id="pickupDate"
                  label="Fecha"
                  error={errors.pickupDate}
                  touched={touched.pickupDate}
                  value={values.pickupDate}
                  type="date"
                  min={getMinDate()}
                  handleBlur={handleBlur}
                  handleChange={(e) => handleDateChange(e, setFieldValue)}
                />
                <Select
                  labelSize={17}
                  disabled={isLoadingHours || !values.pickupDate}
                  id="pickupHour"
                  label="Hora"
                  options={pickupHours}
                  error={errors.pickupHour}
                  touched={touched.pickupHour}
                  value={values.pickupHour}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              </Group>
            </>
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
                  Registrando...
                </>
              : "Registrar"
            }
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default OrderForm;
