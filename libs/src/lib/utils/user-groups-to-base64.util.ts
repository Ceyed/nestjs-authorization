import { GroupEntity } from '@libs/entities/group/group.entity';

export function UserGroupsToBase64(userGroups: { group: GroupEntity }[]): string {
  const groupsToString: string = userGroups
    .map((userGroup) =>
      JSON.stringify({
        scopes: userGroup.group.scopes.join('-').toString(),
        permissions: userGroup.group.permissions.join('-').toString(),
      }),
    )
    .join('|');
  return Buffer.from(groupsToString).toString('base64');
}
