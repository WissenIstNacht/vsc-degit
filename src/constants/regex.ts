export const URL_VALIDATION_REGEXP =
  /^((?:(?:http|ftp|ws)s?|sftp):\/\/?)?([^:/\s.#?]+\.[^:/\s#?]+|localhost)(:\d+)?((?:\/\w+)*\/)?([\w\-.]+[^#?\s]+)?([^#]+)?(#[\w-]*)?$/gm;
export const GH_PROJECT_VALIDATION_REGEXP =
  /^[a-zA-Z]+[a-zA-Z\d\-_]*\/[a-zA-Z]+[a-zA-Z\d\-_]*$/gm;

export const CLONE_NAME_VALIDATION_REGEXP = /^[^\\?\s!%*.:|"\[\]<>]+$/gm;
