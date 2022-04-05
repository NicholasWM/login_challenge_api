import * as fs from 'fs';

export const getImagePath = (filename: string) =>
  `${process.cwd()}/uploads/${filename}`;

export const deleteFile = async (filename: string) => {
  try {
    await fs.promises.stat(`./uploads/${filename}`);
  } catch (error) {
    return;
  }
  await fs.promises.unlink(`./uploads/${filename}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
