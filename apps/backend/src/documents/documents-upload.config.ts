import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

const uploadDir = join(process.cwd(), 'uploads');

function ensureUploadDir(): string {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

export const documentUploadOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ensureUploadDir());
    },
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
};
