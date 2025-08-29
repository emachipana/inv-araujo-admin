import { Container } from "../Categories/styles";
import Category from "../Category";
import { useAdmin } from "../../context/admin";
import { Spinner } from "reactstrap";
import { capitalize } from "../../helpers/capitalize";

function Roles({ isBlocked, currentRole, setFilters }) {
  const { roles, isLoading } = useAdmin();

  const setCurrentRole = (id, name) => {
    if(name === "Todo") return setFilters(filters => ({...filters, role: { id: null, name: null }, page: 0 }));

    setFilters(filters => ({...filters, role: {id, name}, page: 0 }));
  }

  return (
    <Container isLoading={isLoading}>
      {
        isLoading
        ? <Spinner color="secondary" />
        : <>
            <Category 
              isBlocked={isBlocked}
              name="Todo"
              setCurrentCategory={setCurrentRole}
              currentCategory={currentRole}
            />
            {
              roles.map((role, index) => (
                <Category
                  id={role.id}
                  isBlocked={isBlocked}
                  key={index}
                  name={capitalize(role.name.toLowerCase())}
                  currentCategory={currentRole}
                  setCurrentCategory={setCurrentRole}
                />
              ))
            }
          </>
      }
    </Container>
  );
}

export default Roles;
