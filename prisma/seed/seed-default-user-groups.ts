import { AppModulesEnum, PermissionEnum, RoleTypeEnum } from '@prisma/client';

const ADMINISTRATOR_ROLE_ID = '13d4e13a-1d90-4d5f-bf02-2e87647dc0a1';
const MANAGER_ROLE_ID = '46a34a17-2758-49d2-96cd-3f8d02804e54';
const TEAM_LEADER_ROLE_ID = '8100ec7f-1f7c-4788-aef1-05454b595d84';
const EMPLOYEE_ROLE_ID = 'b9f0565a-1460-4e13-ba21-9b16c11e0021';
const SUPERVISOR_ROLE_ID = '28a04c8c-f0b4-48c6-98af-732c2d67bc7e';

// * Define default groups with corresponding permissions
export const defaultUserGroups = [
  {
    name: 'Default Administrator Group',
    role: RoleTypeEnum.Administrator,
    scopes: [AppModulesEnum.All],
    permissions: [PermissionEnum.All],
    roleId: ADMINISTRATOR_ROLE_ID,
  },
  {
    name: 'Default Manager Group',
    role: RoleTypeEnum.Manager,
    scopes: [AppModulesEnum.User, AppModulesEnum.Role, AppModulesEnum.Permission],
    permissions: [PermissionEnum.All],
    roleId: MANAGER_ROLE_ID,
  },
  {
    name: 'Default TeamLeader Group',
    role: RoleTypeEnum.TeamLeader,
    scopes: [AppModulesEnum.Role, AppModulesEnum.User],
    permissions: [PermissionEnum.Create, PermissionEnum.Read, PermissionEnum.Update],
    roleId: TEAM_LEADER_ROLE_ID,
  },
  {
    name: 'default Employee Group',
    role: RoleTypeEnum.Employee,
    scopes: [AppModulesEnum.Role, AppModulesEnum.User],
    permissions: [PermissionEnum.Create, PermissionEnum.Read, PermissionEnum.Update],
    roleId: EMPLOYEE_ROLE_ID,
  },
  {
    name: 'Default Supervisor Group',
    role: RoleTypeEnum.Supervisor,
    scopes: [AppModulesEnum.Role, AppModulesEnum.User],
    permissions: [PermissionEnum.Read],
    roleId: SUPERVISOR_ROLE_ID,
  },
];
