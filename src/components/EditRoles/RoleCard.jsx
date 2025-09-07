import Checkbox from "./CheckBox";
import { isIndeterminate, isPermissionDisabled, togglePermission } from "./handlers";
import { Card, CardBody, CardHeader } from "./styles";

function RoleCard({category, permissions, selectedPermissions, setSelectedPermissions}) {
  const parentKey = Object.keys(permissions)[0];
  const parentChecked = selectedPermissions.includes(parentKey);
  const parentIndeterminate = isIndeterminate(category, selectedPermissions);

  const handleClick = (e) => {
    e.preventDefault();
    togglePermission(parentKey, true, category, selectedPermissions, setSelectedPermissions)
  }

  const permissionsList = Object.entries(permissions);
  const permissionsSize = permissionsList.length;

  return (
    <Card 
      height={permissionsSize <= 3 ? "200px" : permissionsSize <= 5 ? "290px" : "auto"}
    >
      <CardHeader>
        <Checkbox
          id={`perm-${parentKey}`}
          checked={parentChecked || parentIndeterminate}
          label={`${category?.charAt(0).toUpperCase() + category?.slice(1)}`}
          style={{ fontWeight: 600 }}
          onClick={handleClick}
        />
      </CardHeader>
      <CardBody>
        {permissionsList.map(([key, label]) => (
          <Checkbox
            id={`perm-${key}`}
            checked={selectedPermissions.includes(key)}
            onChange={(e) => togglePermission(e, false, "", selectedPermissions, setSelectedPermissions)}
            disabled={isPermissionDisabled(key, parentKey, selectedPermissions)}
            label={label}
            key={key}
          />
        ))}
      </CardBody>
    </Card>
  );
}

export default RoleCard;
