import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITINDetailsService } from './itin-details.service';
import { ITINTable } from './itin-details.entity';

const mockITINRecords = [
  { profileId: 1, itinNumber: 'ITIN123' },
  { profileId: 2, itinNumber: 'ITIN456' },
];

const mockRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('ITINDetailsService', () => {
  let service: ITINDetailsService;
  let repository: jest.Mocked<Repository<ITINTable>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ITINDetailsService,
        {
          provide: getRepositoryToken(ITINTable),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ITINDetailsService>(ITINDetailsService);
    repository = module.get<Repository<ITINTable>>(getRepositoryToken(ITINTable)) as jest.Mocked<Repository<ITINTable>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdate', () => {
    it('should update an existing record', async () => {
      repository.findOneBy.mockResolvedValue(mockITINRecords[0]);
      repository.save.mockResolvedValue(mockITINRecords[0]);

      const result = await service.createOrUpdate(1, 'ITIN789');
      expect(repository.findOneBy).toHaveBeenCalledWith({ profileId: 1 });
      expect(repository.save).toHaveBeenCalled();
      expect(result.itinNumber).toBe('ITIN789');
    });

    it('should create a new record if it does not exist', async () => {
      repository.findOneBy.mockResolvedValue(undefined);
      const newRecord = { profileId: 3, itinNumber: 'ITIN789' };
      repository.create.mockReturnValue(newRecord);
      repository.save.mockResolvedValue(newRecord);

      const result = await service.createOrUpdate(3, 'ITIN789');
      expect(repository.findOneBy).toHaveBeenCalledWith({ profileId: 3 });
      expect(repository.create).toHaveBeenCalledWith({ profileId: 3, itinNumber: 'ITIN789' });
      expect(repository.save).toHaveBeenCalledWith(newRecord);
      expect(result).toEqual(newRecord);
    });
  });

  describe('findByProfileId', () => {
    it('should return a record by profileId', async () => {
      repository.findOneBy.mockResolvedValue(mockITINRecords[0]);

      const result = await service.findByProfileId(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ profileId: 1 });
      expect(result).toEqual(mockITINRecords[0]);
    });

    it('should return undefined if no record is found', async () => {
      repository.findOneBy.mockResolvedValue(undefined);

      const result = await service.findByProfileId(3);
      expect(repository.findOneBy).toHaveBeenCalledWith({ profileId: 3 });
      expect(result).toBeUndefined();
    });
  });
});
