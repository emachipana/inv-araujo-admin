import Select from "../../../components/Input/Select";
import ShippingType from "../../../components/OrderForm/ShippingType";
import { Group } from "../../../components/ProductForm/styles";
import { onDepChange } from "../../../components/VitroForm/handlers";
import { COLORS } from "../../../styles/colors";
import { Text } from "../../../styles/layout";
import apiFetch from "../../../services/apiFetch";
import toast from "react-hot-toast";
import { departments, provinces } from "../../../data/places";
import { useState } from "react";
import Input from "../../../components/Input";

function SelectShipping({ shipType, setShipType, setFieldValue, values, errors, touched, handleBlur, handleChange }) {
  const [currentDep, setCurrentDep] = useState("");
  const [pickupHours, setPickupHours] = useState([]);
  const [isLoadingHours, setIsLoadingHours] = useState(false);

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
    setFieldValue('date', selectedDate);
    setFieldValue('hour', '');
    
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
    <>
      <ShippingType 
        shipType={shipType}
        setShipType={setShipType}
        setFieldValue={setFieldValue}
        withTitle={false}
      />
      {
        shipType === "ENVIO_AGENCIA"
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
              labelSize={16}
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
              labelSize={16}
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
          <Text
            align="start"
            style={{alignSelf: "flex-start", marginBottom: "-0.8rem"}}
            size={18.5}
            weight={700}
            color={COLORS.dim}
          >
            Datos de quien recoje
          </Text>
          <Input
            labelSize={16}
            id="fullName"
            placeholder="Ingresa el nombre completo"
            label="Nombre completo"
            error={errors.fullName}
            touched={touched.fullName}
            value={values.fullName}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
          <Group>
            <Input
              labelSize={16}
              id="document"
              placeholder="Ingresa el DNI"
              label="DNI"
              error={errors.document}
              touched={touched.document}
              value={values.document}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <Input
              labelSize={16}
              id="phone"
              placeholder="Ingresa el teléfono"
              label="Teléfono"
              error={errors.phone}
              touched={touched.phone}
              value={values.phone}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
        </>
      }
      {
        shipType === "RECOJO_ALMACEN"
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
              labelSize={16}
              id="date"
              label="Fecha"
              error={errors.date}
              touched={touched.date}
              value={values.date}
              type="date"
              min={getMinDate()}
              handleBlur={handleBlur}
              handleChange={(e) => handleDateChange(e, setFieldValue)}
            />
            <Select
              labelSize={16}
              disabled={isLoadingHours || !values.date}
              id="hour"
              label="Hora"
              options={pickupHours}
              error={errors.hour}
              touched={touched.hour}
              value={values.hour}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </Group>
        </>
      }
    </>
  );
}

export default SelectShipping;
