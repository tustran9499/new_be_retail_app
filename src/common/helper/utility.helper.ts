import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { PHONE_PREFIX } from '../constants/phone-prefix.emum';
import { RESPONSE_MESSAGES } from '../constants/response-messages.enum';
import { getExtension } from '../utils/getExtension.utility';
import { customThrowError } from './throw.helper';

export const getValuesFromConstantObject = (
  obj: Record<string, unknown>,
): any[] => {
  return Object.keys(obj).map(key => obj[key]);
};

export const getObjectFromEnum = (
  customEnum: Record<string, any>,
): Record<string, unknown> => {
  const result: Record<string, any> = {};
  const keys = getKeyNameFromEnum(customEnum);
  keys.map(key => {
    result[key] = customEnum[key];
  });

  return result;
};

export const getKeyNameFromEnum = (
  customEnum: Record<string, unknown>,
): string[] => Object.keys(customEnum).filter(key => !(parseInt(key) >= 0));

export const getValuesFromEnum = (customEnum: Record<string, any>): any[] => {
  // const result = [];

  const keys = getKeyNameFromEnum(customEnum);
  return keys.map(key => customEnum[key]);
};

export const getNamePartFromFullName = (name: string): string[] => {
  let firstName = '';
  let lastName = '';

  const nameParts = name.split(' ');

  firstName = nameParts[0];

  nameParts.shift();

  if (nameParts.length) {
    lastName = nameParts.join(' ');
  }

  return [firstName, lastName];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const imageFileFilter = (req: any, file: any, callback: any): any => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return callback(
      new HttpException(
        { message: 'Only images and pdf are allowed' },
        HttpStatus.BAD_REQUEST,
      ),
    );
  }
  callback(null, true);
};

const audioMimeTypes = [
  'audio/mpeg',
  // 'audio/vnd.wav',
  // 'audio/m4a',
  // 'audio/mp4',
];

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (a, b, c?) => void,
): void => {
  // const extension = mimeTypes.extension(file.mimetype);
  const extension = getExtension(file);

  const randomName = uuidv4();
  callback(null, `${randomName}.${extension}`);
};

export const multerOptions = {
  fileFilter: imageFileFilter,
  limits: { fileSize: 3000000 },
  storage: diskStorage({
    destination: './uploads',
    filename: editFileName,
  }),
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const audioFileFilter = (req: any, file: any, callback: any): any => {
  if (!audioMimeTypes.includes(file.mimetype)) {
    return callback(
      new HttpException(
        { message: 'Only mp3 audio files are allowed' },
        HttpStatus.BAD_REQUEST,
      ),
    );
  }
  callback(null, true);
};

export const hourToMs = (hours: number): number => {
  return hours * 60 * 60 * 1000;
  // hours * min * sec * ms
};

// Generate date string with format: ddmmyy
export const getTwoDigitsDateString = (date: Date): string => {
  const day = ('0' + date.getDate().toString()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).toString().slice(-2);
  const year = date.getFullYear().toString().substr(-2);

  return day + month + year;
};

export const generateRandomCode = (digit: number): string => {
  const startPosition = 2; // After '0.' char
  const endPosition = startPosition + digit;
  return `${Math.random()}`.substring(startPosition, endPosition);
};

export const formatPhone = (phoneNumber: string): string => {
  let phone = phoneNumber.replace(/[\+\s]/g, '');
  if (phone.length > PHONE_PREFIX.VN_LENGTH_LIMIT) {
    customThrowError(
      RESPONSE_MESSAGES.PHONE_INPUT_TOO_LONG,
      HttpStatus.BAD_REQUEST,
    );
  }
  if (
    phone.charAt(0) !== '0' &&
    phone.substring(0, 2) !== PHONE_PREFIX.VN_FORMAT
  ) {
    customThrowError(
      RESPONSE_MESSAGES.WRONG_PHONE_NUMBER_FORMAT,
      HttpStatus.BAD_REQUEST,
    );
  }

  if (phone.charAt(0) === '0') {
    phone = phone.replace('0', PHONE_PREFIX.VN_FORMAT);
  }

  return phone;
};

export const getNickname = (user: Record<string, any>): string => {
  if (user.FName) {
    return user.FName;
  }
  let nickname = user.Email;
  nickname = nickname.substring(0, nickname.lastIndexOf('@'));
  return nickname;
};

export const flattenObject = (
  data: Record<string, any>,
  prefix: string,
  init: Record<string, any>,
): Record<string, any> => {
  let result = init;
  Object.keys(data).forEach(key => {
    const modifiedPrefix = prefix ? `${prefix}.` : prefix;
    if (typeof data[key] === 'string' || typeof data[key] === 'number') {
      const realKey = `${modifiedPrefix}${key}`;
      const value = data[key];
      result = { ...result, [realKey]: value };
    } else {
      result = {
        ...result,
        ...flattenObject(data[key], `${modifiedPrefix}${key}`, result),
      };
    }
  });
  return result;
};
