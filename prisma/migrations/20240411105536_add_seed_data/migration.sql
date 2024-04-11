-- Define default roles
INSERT INTO roles ("id", "name", "luckyNumber", "type", "priority", "updatedAt") 
VALUES ('13d4e13a-1d90-4d5f-bf02-2e87647dc0a1', 'Default Administrator', 42, 'Administrator', 0, CURRENT_TIMESTAMP);

INSERT INTO roles ("id", "name", "luckyNumber", "type", "priority", "updatedAt") 
VALUES ('46a34a17-2758-49d2-96cd-3f8d02804e54', 'Default Manager', 17, 'Manager', 1, CURRENT_TIMESTAMP);

INSERT INTO roles ("id", "name", "luckyNumber", "type", "priority", "updatedAt") 
VALUES ('8100ec7f-1f7c-4788-aef1-05454b595d84', 'Default Team Leader', 8, 'TeamLeader', 2, CURRENT_TIMESTAMP);

INSERT INTO roles ("id", "name", "luckyNumber", "type", "priority", "updatedAt") 
VALUES ('b9f0565a-1460-4e13-ba21-9b16c11e0021', 'Default Employee', 5, 'Employee', 3, CURRENT_TIMESTAMP);

INSERT INTO roles ("id", "name", "luckyNumber", "type", "priority", "updatedAt") 
VALUES ('28a04c8c-f0b4-48c6-98af-732c2d67bc7e', 'Default Supervisor', 10, 'Supervisor', 4, CURRENT_TIMESTAMP);


-- Define default groups
INSERT INTO groups ("id", name, "roleId", scopes, permissions, "updatedAt", "isDefault") 
VALUES (gen_random_uuid(), 'Default Administrator Group', '13d4e13a-1d90-4d5f-bf02-2e87647dc0a1', '{"All"}', '{"All"}', CURRENT_TIMESTAMP, false);

INSERT INTO groups ("id", name, "roleId", scopes, permissions, "updatedAt", "isDefault") 
VALUES (gen_random_uuid(), 'Default Manager Group', '46a34a17-2758-49d2-96cd-3f8d02804e54', '{"User","Role","Permission","Auth"}', '{"All"}', CURRENT_TIMESTAMP, false);

INSERT INTO groups ("id", name, "roleId", scopes, permissions, "updatedAt", "isDefault") 
VALUES (gen_random_uuid(), 'Default TeamLeader Group', '8100ec7f-1f7c-4788-aef1-05454b595d84', '{"Role","User","Auth"}', '{"Create","Read","Update"}', CURRENT_TIMESTAMP, false);

INSERT INTO groups ("id", name, "roleId", scopes, permissions, "updatedAt", "isDefault") 
VALUES (gen_random_uuid(), 'Default Employee Group', 'b9f0565a-1460-4e13-ba21-9b16c11e0021', '{"Role","User","Auth"}', '{"Create","Read","Update"}', CURRENT_TIMESTAMP, true);

INSERT INTO groups ("id", name, "roleId", scopes, permissions, "updatedAt", "isDefault") 
VALUES (gen_random_uuid(), 'Default Supervisor Group', '28a04c8c-f0b4-48c6-98af-732c2d67bc7e', '{"Role","User","Auth"}', '{"Read"}', CURRENT_TIMESTAMP, false);
