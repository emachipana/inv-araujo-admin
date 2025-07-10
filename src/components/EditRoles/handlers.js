import { PERMISSIONS } from "../../data/permissions";

export const isPermissionDisabled = (permissionKey, parentKey, selectedPermissions) => {
  if (permissionKey !== parentKey && !selectedPermissions.includes(parentKey)) {
    return true;
  }
  
  for (const [requiredPermission, dependentPermissions] of Object.entries(SPECIAL_DEPENDENCIES)) {
    if (dependentPermissions.includes(permissionKey) && !selectedPermissions.includes(requiredPermission)) {
      return true;
    }
  }
  
  return false;
};

const SPECIAL_DEPENDENCIES = {
  'INVITRO_ADVANCE_WATCH': ['INVITRO_ADVANCE_CREATE', 'INVITRO_ADVANCE_UPDATE'],
  'EXPENSES_WATCH': ['EXPENSES_CREATE', 'EXPENSES_UPDATE', 'EXPENSES_DELETE']
};

const getDependentPermissions = (permissionKey) => {
  const dependencies = [];
  
  if (SPECIAL_DEPENDENCIES[permissionKey]) {
    dependencies.push(...SPECIAL_DEPENDENCIES[permissionKey]);
  }
  
  // eslint-disable-next-line
  for (const [_, permissions] of Object.entries(PERMISSIONS)) {
    const permissionKeys = Object.keys(permissions);
    const parentKey = permissionKeys[0];
    
    if (permissionKey === parentKey) {
      permissionKeys.slice(1).forEach(child => {
        if (!dependencies.includes(child)) {
          dependencies.push(child);
        }
      });
    }
  }
  
  return dependencies;
};

export const togglePermission = (e, isParent = false, parentKey = '', selectedPermissions, setSelectedPermissions) => {
  if (isParent && parentKey) {
    const permission = e;
    const categoryPermissions = PERMISSIONS[parentKey] || {};
    const allChildPermissions = Object.keys(categoryPermissions).slice(1);
    const isCurrentlySelected = selectedPermissions.includes(permission);
    
    setSelectedPermissions(prev => {
      if (!isCurrentlySelected) {
        return [...new Set([...prev, permission, ...allChildPermissions])];
      } else {
        return prev.filter(p => p !== permission && !allChildPermissions.includes(p));
      }
    });
    return;
  }

  if (e && e.target) {
    const { id, checked } = e.target;
    const permissionKey = id.replace('perm-', '');
    
    if (!checked) {
      setSelectedPermissions(prev => {
        const dependentPermissions = getDependentPermissions(permissionKey);
        
        return prev.filter(p => p !== permissionKey && !dependentPermissions.includes(p));
      });
      return;
    }
    
    if (checked) {
      const category = Object.entries(PERMISSIONS).find(([_, perms]) => 
        Object.keys(perms).includes(permissionKey)
      );
      
      if (category) {
        // eslint-disable-next-line
        const [categoryKey, categoryPerms] = category;
        const categoryParentKey = Object.keys(categoryPerms)[0];
        
        if (permissionKey !== categoryParentKey && !selectedPermissions.includes(categoryParentKey)) {
          setSelectedPermissions(prev => [...new Set([...prev, categoryParentKey, permissionKey])]);
          return;
        }
      }
      
      setSelectedPermissions(prev => [...new Set([...prev, permissionKey])]);
    }
  }
};

export const isIndeterminate = (parentKey, selectedPermissions) => {
  const childPermissions = Object.keys(PERMISSIONS[parentKey] || {});
  if (childPermissions.length === 0) return false;
  const selectedCount = childPermissions.filter(p => selectedPermissions.includes(p)).length;
  return selectedCount > 0 && selectedCount < childPermissions.length;
};
