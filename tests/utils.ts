/**
 * 
 * @param item Takes any data and replaces the serialized _id :{$oid } 
 * with simple id
 * @returns 
 */
export function fixTheId<T extends { _id: { $oid: string } }>(item: T) {
  let { _id, ...rest } = ({ ...item, id: item._id?.$oid })
  return rest
}
const regex = new RegExp(/^.*?[.!?](?=\s[A-Z]|\s?$)(?!.*\))/);
/**
 * 
 * @param str - any long paragraph, which need to shortened down
 * @returns - returns sentence or question of the paragraph
 */
export const shorten = (str: string, len = 40, force = false): string => {
  if (force) {
    return str.substring(0, len)
  }
  const result = str.match(regex);
  if (result !== null) {
    return result[0].trim();
  }
  return str.substring(0, len);
};