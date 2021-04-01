import * as mimeTypes from 'mime-types';
export const getExtension = (file: Express.Multer.File): string => {
  let extension = null;
  if (!mimeTypes.extension(file.mimetype)) {
    extension = file.originalname.substr(
      file.originalname.lastIndexOf('.') + 1,
    );
  } else {
    extension = mimeTypes.extension(file.mimetype);
  }
  return extension;
};
