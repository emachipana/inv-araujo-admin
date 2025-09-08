import { Formik } from "formik";
import { Form } from "../EditCategories/styles";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";
import { Spinner } from "reactstrap";
import { FlexRow, Text } from "../../styles/layout";
import { PERMISSIONS } from "../../data/permissions";
import RoleCard from "./RoleCard";
import { validate } from "./validate";
import { MdAddBox } from "react-icons/md";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";

function AddRole({ setCurrentAction, addRole }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      const body = {
        name: values.name,
        permissions: selectedPermissions
      };

      await addRole(body);
      resetForm();
      setSelectedPermissions([]);
      setCurrentAction('roles');
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error(errorParser(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: '' }}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleBlur,
        handleChange,
        handleSubmit
      }) => (
        <Form 
          onSubmit={handleSubmit}
          width="100%"
        >
          <FlexRow 
            justify="space-between"
            align="flex-end"
            gap={2}
            width="100%"
          >
            <Input
              style={{maxWidth: "70%"}}
              fontSize={15}
              label="Nombre del rol"
              labelSize={16}
              error={errors.name}
              id="name"
              name="name"
              placeholder="Ingresa el nombre del rol"
              value={values.name}
              handleBlur={handleBlur}
              handleChange={handleChange}
              touched={touched.name}
            />
            <Button
              type="submit"
              iconSize={18}
              disabled={isLoading || !isValid || selectedPermissions.length === 0}
              fontSize={16}
              Icon={MdAddBox}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  Creando rol...
                </>
              ) : (
                'Crear rol'
              )}
            </Button>
          </FlexRow>

          <Text weight="700" size={16} mb={3}>
            Permisos
          </Text>
          <FlexRow 
            gap={1}
            style={{flexWrap: "wrap"}}
            // align="flex-start"
            justify="space-around"
          >
            {
              Object.entries(PERMISSIONS).map(([category, perms]) => (
                <RoleCard
                  key={category}
                  category={category}
                  permissions={perms}
                  selectedPermissions={selectedPermissions}
                  setSelectedPermissions={setSelectedPermissions}
                />
              ))
            }
          </FlexRow>
        </Form>
      )}
    </Formik>
  );
}

export default AddRole;
