import { RoleTypeEnum } from '@prisma/client';

export const ADMINISTRATOR_ROLE_ID = '13d4e13a-1d90-4d5f-bf02-2e87647dc0a1';
export const MANAGER_ROLE_ID = '46a34a17-2758-49d2-96cd-3f8d02804e54';
export const TEAM_LEADER_ROLE_ID = '8100ec7f-1f7c-4788-aef1-05454b595d84';
export const EMPLOYEE_ROLE_ID = 'b9f0565a-1460-4e13-ba21-9b16c11e0021';
export const SUPERVISOR_ROLE_ID = '28a04c8c-f0b4-48c6-98af-732c2d67bc7e';

export const rolesData = [
  {
    id: ADMINISTRATOR_ROLE_ID,
    name: 'Default Administrator',
    luckyNumber: 42,
    type: RoleTypeEnum.Administrator,
    priority: 0,
  },
  {
    id: MANAGER_ROLE_ID,
    name: 'Default Manager',
    luckyNumber: 17,
    type: RoleTypeEnum.Manager,
    priority: 1,
  },
  {
    id: TEAM_LEADER_ROLE_ID,
    name: 'Default Team Leader',
    luckyNumber: 8,
    type: RoleTypeEnum.TeamLeader,
    priority: 2,
  },
  {
    id: EMPLOYEE_ROLE_ID,
    name: 'Default Employee',
    luckyNumber: 5,
    type: RoleTypeEnum.Employee,
    priority: 3,
  },
  {
    id: SUPERVISOR_ROLE_ID,
    name: 'Default Supervisor',
    luckyNumber: 10,
    type: RoleTypeEnum.Supervisor,
    priority: 4,
  },
];
