import { diskStorage } from 'multer';
import { extname } from 'path';

function generateFilename(file) {
  return `${file.originalname.substring(
    0,
    file.originalname.lastIndexOf('.'),
  )}-${Date.now()}${extname(file.originalname)}`;
}

export function storage(destination: string) {
  return diskStorage({
    destination: `.${destination}`,
    filename: (req, file, callback) => {
      callback(null, generateFilename(file));
    },
  });
}
