import { Formik } from "formik";
import { validate } from "./validate";
import { FlexRow, Form, Text } from "../../styles/layout";
import { Group, Title } from "../ProductForm/styles";
import Button from "../Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "reactstrap";
import { useState, useEffect } from "react";
import { useAdmin } from "../../context/admin";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";
import Input from "../Input";
import MapPicker from "../MapPicker";
import { MapContainer, MapFooter } from "./styles";
import { reverseGeocode } from "../MapPicker/utils";
import { COLORS } from "../../styles/colors";
import { useAuth } from "../../context/auth";

function WarehouseForm({ initialValues = {
  name: "",
  ref: "",
  address: "",
  province: "",
  district: "",
  department: "",
  latitude: "",
  longitude: "",
}, isToCreate, warehouseId, setIsActive }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const { addWarehouse, updateWarehouse } = useAdmin();
  const { user } = useAuth();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleLocationSelect = async (latlng, setFieldValue) => {
    try {
      setIsMapLoading(true);
      const { lat, lng } = latlng;
      
      setFieldValue('latitude', lat);
      setFieldValue('longitude', lng);
      
      const addressData = await reverseGeocode(lat, lng);
      
      setFieldValue('address', addressData.address);
      setFieldValue('district', addressData.district);
      setFieldValue('province', addressData.province);
      setFieldValue('department', addressData.department);
      
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      toast.error('No se pudo obtener la dirección. Por favor, inténtalo de nuevo.');
    } finally {
      setIsMapLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      values.employeeId = user.employeeId;
      isToCreate ? await addWarehouse(values) : await updateWarehouse(warehouseId, values);
      setIsLoading(false);
      setIsActive(false);
    } catch(error) {
      setIsLoading(false);
      toast.error(errorParser(error.message));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      enableReinitialize
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
          <Title>{isToCreate ? "Nuevo almacén" : "Editar almacén"}</Title>
          <MapContainer>
            <MapPicker
              initialPosition={values.latitude && values.longitude 
                ? { lat: parseFloat(values.latitude), lng: parseFloat(values.longitude) } 
                : null}
              onLocationSelect={(latlng) => handleLocationSelect(latlng, setFieldValue)}
              isViewOnly={!isToCreate}
            />
            <MapFooter>
              {
                isMapLoading 
                ? <FlexRow>
                    <Spinner 
                      size="sm" 
                      color="secondary" />
                    <Text
                      size={14}
                      weight={500}
                      color={COLORS.dim}
                    >
                      Obteniendo dirección...
                    </Text>
                  </FlexRow>
                : <Text
                    size={14}
                    weight={500}
                    color={COLORS.dim}
                  >
                    Haz clic en el mapa para seleccionar la ubicación
                  </Text>
              }
            </MapFooter>
          </MapContainer>
          <Group>
            <Input
              id="name"
              label="Nombre"
              placeholder="Ingresa el nombre"
              error={errors.name}
              touched={touched.name}
              value={values.name}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <Input
              id="ref"
              label="Referencia"
              placeholder="Ingresa la referencia"
              error={errors.ref}
              touched={touched.ref}
              value={values.ref}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </Group>
          <Group>
            <Input
              id="address"
              label="Dirección"
              placeholder="Selecciona una ubicación en el mapa"
              error={errors.address}
              touched={touched.address}
              value={values.address}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={isMapLoading}
            />
            <Input
              id="district"
              label="Distrito"
              placeholder="Selecciona una ubicación en el mapa"
              error={errors.district}
              touched={touched.district}
              value={values.district}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={isMapLoading}
            />
          </Group>
          <Group>
            <Input
              id="province"
              label="Provincia"
              placeholder="Selecciona una ubicación en el mapa"
              error={errors.province}
              touched={touched.province}
              value={values.province}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={isMapLoading}
            />
            <Input
              id="department"
              label="Departamento"
              placeholder="Selecciona una ubicación en el mapa"
              error={errors.department}
              touched={touched.department}
              value={values.department}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={isMapLoading}
            />
          </Group>
          <input type="hidden" name="latitude" value={values.latitude || ''} />
          <input type="hidden" name="longitude" value={values.longitude || ''} />
          <Button
            type="submit"
            iconSize={18}
            fontSize={17}
            size="full"
            style={{ marginTop: "1rem" }}
            disabled={!isValid || isLoading || isMapLoading}
            Icon={isLoading ? null : IoMdAddCircleOutline}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                {isToCreate ? "Agregando..." : "Editando..."}
              </>
            ) : isToCreate ? (
              "Agregar"
            ) : (
              "Actualizar"
            )}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default WarehouseForm;
