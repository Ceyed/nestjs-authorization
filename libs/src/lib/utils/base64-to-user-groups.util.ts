export function Base64ToUserGroups(groups: string): Record<string, string[]>[] {
  const groupsInString: string = Buffer.from(groups, 'base64').toString('ascii');

  return groupsInString.split('|').map((scope) => {
    const jsonScop = JSON.parse(scope);
    Object.keys(jsonScop).forEach((item) => {
      jsonScop[item] = jsonScop[item].split('-');
    });
    return jsonScop;
  });
}
