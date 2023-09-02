import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CreateUserInput } from './dto/create-user.input';
import { In } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { ProductDto } from '../products/dto/product.dto';

describe('UsersService', () => {
  let service: UsersService;
  const testUserId1 = "40134b1d-8d92-4288-8acd-cee7df2b9649";
  const testUserId2 = "40134b1d-8d92-4288-8acd-cee7df2b9648"; 
  const testUserName1 = "test-user-1";
  const testUserName2 = "test-user-2"
  const userRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn()
  };
  const productRepositoryMock = {
    find: jest.fn(),
  };
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock
        },
        {
          provide: getRepositoryToken(Product),
          useValue: productRepositoryMock
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should create', () => {
    it('should create with no orderIds', async () => {
      const createUserInput: CreateUserInput = {
        name: testUserName1,
        email: "le-email",
        age: 27,
        orderIds: []
      };
  
      const newUser: User = {
        id: testUserId1,
        orders: [],
        ...createUserInput,
      };
  
      userRepositoryMock.save.mockResolvedValue(newUser)
      const result = await service.create(createUserInput);

      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        age: 27, 
        email: "le-email", 
        name: "test-user-1", 
        orders: undefined
      });
      expect(productRepositoryMock.find).not.toBeCalled();
    });

    it('should create with with orderIds', async () => {
      const createUserInput: CreateUserInput = {
        name: testUserName1,
        email: "le-email",
        age: 27,
        orderIds: ["so-uuid-of-a-product"]
      };
  
      const newUser: User = {
        name: testUserName1,
        id: testUserId1,
        email: "le-email",
        age: 27,
        orders: [{
          id: "so-uuid-of-a-product",
          name: "my-product",
          price: 1.00
        }],
      };
  
      userRepositoryMock.save.mockResolvedValue(newUser)
      const result = await service.create(createUserInput);

      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        age: 27, 
        email: "le-email", 
        name: "test-user-1", 
        orders: undefined
      });
      expect(productRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(productRepositoryMock.find).toHaveBeenCalledWith({
        where: {
          id: In(createUserInput.orderIds)
        }
      });

      expect(result).toEqual({
        ...newUser,
        orders: [...newUser.orders]
      });
    });
  });

  it('should findAll', async () => {
    const users: User[] = [{
        id: testUserId1,
        email: "le-email",
        name: testUserName1,
        age: 20,
        orders: undefined
      },
      {
        id: testUserId2,
        email: "le-email",
        name: testUserName2,
        age: 20,
        orders: undefined
      }
    ]
    userRepositoryMock.find.mockResolvedValue(users);
    const result = await service.findAll();

    expect(userRepositoryMock.find).toHaveBeenCalled();
    expect(userRepositoryMock.find).toHaveBeenCalledWith();

    expect(result).toEqual(users as UserDto[]);
  });

  it('should findOne', async () => {

    const user = {
      id: testUserId1,
      email: "le-email",
      name: testUserName1,
      age: 20,
      orders: undefined
    }
    
    userRepositoryMock.findOneBy.mockResolvedValue(user);
    const result = await service.findOne(testUserId1);

    expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: testUserId1});
    expect(result).toEqual(user);
    
  });

  describe('update', () => {

    it('should update without products', async () => {
      const updateUserInput: UpdateUserInput = {
        id: testUserId1,
        age: 20,
        email: "new email"
      };

      const oldUser: User = {
        id: testUserId1,
        name: "name",
        age: 22,
        email: "email",
        orders: []
      };

      const updatedUser: User = {
        id: testUserId1,
        name: "name",
        age: 20,
        email: "new email",
        orders: []
      };

      userRepositoryMock.findOne.mockResolvedValue(oldUser);
      userRepositoryMock.save.mockResolvedValue(updatedUser);
      productRepositoryMock.find.mockResolvedValue([]);
      
      const result = await service.update(updateUserInput);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: updateUserInput.id,
        },
        relations: {
          orders: true
        }
      });

      expect(productRepositoryMock.find).not.toHaveBeenCalled();
      expect(userRepositoryMock.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual({...updatedUser})

    });

    it('should update products', async () => {
      const product: Product = {
        id: "some-product-id",
        name: "cool product",
        price: 1.00
      }
      const updateUserInput: UpdateUserInput = {
        id: testUserId1,
        age: 20,
        email: "new email",
        orderIds: ["some-product-id"]
      };

      const oldUser: User = {
        id: testUserId1,
        name: "name",
        age: 22,
        email: "email",
        orders: []
      };

      const updatedUser: User = {
        id: testUserId1,
        name: "name",
        age: 20,
        email: "new email",
        orders: [product]
      };

      userRepositoryMock.findOne.mockResolvedValue(oldUser);
      userRepositoryMock.save.mockResolvedValue(updatedUser);
      productRepositoryMock.find.mockResolvedValue([product]);
      
      const result = await service.update(updateUserInput);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: updateUserInput.id,
        },
        relations: {
          orders: true
        }
      });

      expect(productRepositoryMock.find).toHaveBeenCalled();
      expect(productRepositoryMock.find).toHaveBeenCalledWith({
        where: {
          id: In([product.id])
        }
      })
      expect(userRepositoryMock.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual({
        ...updatedUser,
        orders: [
          { ...product } as ProductDto
        ]
      } as UserDto)
    });
  });
  
});
