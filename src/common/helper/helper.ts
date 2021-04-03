import { extname } from 'path'
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|PNG|JPEG|GIF)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

export const csvFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(csv|xlsx|txt)$/)) {
      return callback(new Error('Only csv, excel files are allowed!'), false);
    }
    callback(null, true);
};


export const editImportServerFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${req.user.UserId}${fileExtName}`);
};
