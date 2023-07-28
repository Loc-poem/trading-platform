import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidatorService {
  public isImage(mimeType: string): boolean {
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/apng',
      'image/svg+xml',
      'image/webp',
    ];

    return imageMimeTypes.includes(mimeType);
  }
}
