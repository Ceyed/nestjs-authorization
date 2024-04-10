import { AppModulesEnum } from '@libs/enums/app-modules.enum';
import { PermissionEnum } from '@libs/enums/permission.enum';
import { RoleTypeEnum } from '@libs/enums/role-type.enum';

// * Define default groups with corresponding permissions
export const defaultUserGroups = [
  {
    name: 'Default Administrator Group',
    role: RoleTypeEnum.Administrator,
    scopes: [AppModulesEnum.All],
    permissions: [PermissionEnum.All],
  },
  {
    name: 'Default Manager Group',
    role: RoleTypeEnum.Manager,
    scopes: [AppModulesEnum.User, AppModulesEnum.Role, AppModulesEnum.Permission],
    permissions: [PermissionEnum.All],
  },
  {
    name: 'Default TeamLeader Group',
    role: RoleTypeEnum.TeamLeader,
    scopes: [AppModulesEnum.Role, AppModulesEnum.User],
    permissions: [PermissionEnum.Create, PermissionEnum.Read, PermissionEnum.Update],
  },
  {
    name: 'default Employee Group',
    role: RoleTypeEnum.Employee,
    scopes: [AppModulesEnum.Role, AppModulesEnum.User],
    permissions: [PermissionEnum.Create, PermissionEnum.Read, PermissionEnum.Update],
  },
  {
    name: 'Default Supervisor Group',
    role: RoleTypeEnum.Supervisor,
    scopes: [AppModulesEnum.Role, AppModulesEnum.User],
    permissions: [PermissionEnum.Read],
  },
];