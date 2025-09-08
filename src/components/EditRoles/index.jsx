import { useState } from "react";
import { useAdmin } from "../../context/admin";
import { Container, Section } from "../EditCategories/styles";
import { Title } from "../../pages/admin/styles";
import { Container as Navigation } from "../Categories/styles";
import NewCategory from "../Category/New";
import { FaRegEye } from "react-icons/fa6";
import { MdAddCircleOutline } from "react-icons/md";
import AddRole from "./AddRole";
import { RoleContainer } from "./styles";
import { FlexRow, Text } from "../../styles/layout";
import { capitalize } from "../../helpers/capitalize";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { COLORS } from "../../styles/colors";
import { IoIosCheckbox } from "react-icons/io";
import { PERMISSIONS } from "../../data/permissions";

const getPermissionText = (permissionKey) => {
  for (const category of Object.values(PERMISSIONS)) {
    if (category[permissionKey]) {
      return category[permissionKey];
    }
  }
  return permissionKey.toLowerCase();
};

function EditRoles() {
  const { roles, addRole, deleteRole } = useAdmin();
  const [currentAction, setCurrentAction] = useState("roles");

  return (
    <Container>
      <Title
        size={1.5}
      >
        { currentAction === "roles" ? "Roles" : "Agregar rol" }
      </Title>
      <Navigation>
        <NewCategory
          onClick={() => setCurrentAction("roles")}
          Icon={FaRegEye}
          isActive={currentAction === "roles"}
        >
          Ver roles
        </NewCategory>
        <NewCategory
          onClick={() => setCurrentAction("addRole")}
          Icon={MdAddCircleOutline}
          isActive={currentAction === "addRole"}
        >
          Agregar rol
        </NewCategory>
      </Navigation>
      <Section>
        {
          currentAction === "roles"
          ? <>
              {
                roles.map((role, index) => (
                  <RoleContainer
                    key={index}
                  >
                    <FlexRow 
                      width="100%"
                      justify="space-between"
                    >
                      <Text
                        weight={600}
                        size={17}
                      >
                        { capitalize(role.name?.toLowerCase()) }
                      </Text>
                      <FlexRow>
                        <FaEdit
                          size={19}
                          color={COLORS.dim}
                          style={{cursor: "pointer"}}
                        />
                        <FaTrashAlt
                          size={18}
                          color={COLORS.red}
                          style={{cursor: "pointer"}}
                          onClick={() => deleteRole(role.id)}
                        />
                      </FlexRow>
                    </FlexRow>
                    {
                      role.permissions.length > 0
                      &&
                      <FlexRow
                        gap={1.2}
                        width="100%"
                        justify="flex-start"
                        style={{flexWrap: "wrap"}}
                      >
                        {
                          role.permissions.map((permission, index) => (
                            <FlexRow gap={0.1}>
                              <IoIosCheckbox 
                                size={18}
                                color={COLORS.persian}
                              />
                              <Text
                                key={index}
                                size={15}
                                color={COLORS.dim}
                              >
                                {getPermissionText(permission)}
                              </Text>
                            </FlexRow>
                          ))
                        }
                      </FlexRow>
                    }
                  </RoleContainer>
                ))
              }
            </>
          : <AddRole
              setCurrentAction={setCurrentAction}
              to="roles"
              addRole={addRole}
            />
        }
      </Section>
    </Container>
  );
}

export default EditRoles;

