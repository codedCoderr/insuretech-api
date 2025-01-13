import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let utilService: UtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    utilService = module.get<UtilService>(UtilService);
  });

  describe('generatePolicyNumber', () => {
    it('should return a string', () => {
      const result = utilService.generatePolicyNumber();
      expect(typeof result).toBe('string');
    });

    it('should return a string of length 8', () => {
      const result = utilService.generatePolicyNumber();
      expect(result.length).toBe(8);
    });

    it('should return a string containing only uppercase letters and numbers', () => {
      const result = utilService.generatePolicyNumber();
      const regex = /^[A-Z0-9]+$/;
      expect(regex.test(result)).toBe(true);
    });

    it('should generate unique policy numbers', () => {
      const numbers = new Set();
      for (let i = 0; i < 1000; i++) {
        const number = utilService.generatePolicyNumber();
        numbers.add(number);
      }
      expect(numbers.size).toBeGreaterThan(900);
    });
  });
});
