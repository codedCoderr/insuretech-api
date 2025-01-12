import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  generatePolicyNumber(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
