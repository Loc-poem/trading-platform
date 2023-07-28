import bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const PNF = require('google-libphonenumber').PhoneNumberFormat;
// Get an instance of `PhoneNumberUtil`.
const phoneUtil =
  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
  require('google-libphonenumber').PhoneNumberUtil.getInstance();

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(
  password: string | undefined,
  hash: string | undefined,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts[memberParts.length - 1];
}

export function otp(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);

  const result = Math.floor(Math.random() * (max - min) + min);

  return result.toString();
}

export function convertStringToHex(str: string) {
  let hex = '';

  for (let i = 0; i < str.length; i++) {
    hex += String(str.charCodeAt(i).toString(16));
  }

  return `0x${hex}`;
}

export function convertPhoneNumber(phone: string, twoLetterCode: string) {
  const number = phoneUtil.parse(phone, twoLetterCode);
  const toNumber = phoneUtil.format(number, PNF.E164);
  toNumber.replace('+', '');

  return toNumber as string;
}

export function convertStringToBoolean(check: string | boolean) {
  return check === 'true';
}
