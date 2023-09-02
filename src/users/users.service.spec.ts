import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CreateUserInput } from './dto/create-user.input';
import { In } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { ProductDto } from '../products/dto/product.dto';

describe('UsersService', () => {
  let service: UsersService;
  
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

  const testUserId1 = "40134b1d-8d92-4288-8acd-cee7df2b9649";
  const testUserId2 = "40134b1d-8d92-4288-8acd-cee7df2b9648"; 
  const testUserName1 = "test-user-1";
  const testUserName2 = "test-user-2"

  const createUsers = () => ([
    {
      id: testUserId1,
      email: "le-email@1.com",
      name: testUserName1,
      age: 20,
      orders: []
    },
    {
      id: testUserId2,
      email: "le-email@2.com",
      name: testUserName2,
      age: 20,
      orders: []
    }
  ] as UserEntity[]);

  const createOneUser = () => createUsers()[0];
  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock
        },
        {
          provide: getRepositoryToken(ProductEntity),
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
      const newUser: UserEntity = {
        id: testUserId1,
        name: testUserName1,
        email: createUserInput.email,
        age: createUserInput.age,
        orders: [],
      };
  
      userRepositoryMock.save.mockResolvedValue(newUser)
      const result = await service.create(createUserInput);

      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledWith({
        age: 27, 
        email: "le-email", 
        name: "test-user-1", 
        orders: []
      });
      expect(productRepositoryMock.find).not.toBeCalled();
      expect(result).toEqual({ ...newUser } as UserDto)
    });

    it('should create with with orderIds', async () => {
      const createUserInput: CreateUserInput = {
        name: testUserName1,
        email: "le-email",
        age: 27,
        orderIds: ["so-uuid-of-a-product"]
      };
  
      const newUser: UserEntity = {
        name: testUserName1,
        id: testUserId1,
        email: createUserInput.email,
        age: createUserInput.age,
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
    const users: UserEntity[] = createUsers();
    userRepositoryMock.find.mockResolvedValue(users);
    const result = await service.findAll();

    expect(userRepositoryMock.find).toHaveBeenCalled();
    expect(userRepositoryMock.find).toHaveBeenCalledWith();

    expect(result).toEqual([...users] as UserDto[]);
  });

  it('should findOne', async () => {

    const user = createOneUser();
    userRepositoryMock.findOneBy.mockResolvedValue(user);
    const result = await service.findOne(testUserId1);

    expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: testUserId1});
    expect(result).toEqual({...user } as UserDto);
    
  });

  describe('update', () => {

    it('should update without products', async () => {
      const updateUserInput: UpdateUserInput = {
        id: testUserId1,
        age: 22,
        email: "new email"
      };

      const userToUpdate: UserEntity = createOneUser();

      const updatedUser: UserEntity = {
        id: userToUpdate.id,
        name: userToUpdate.name,
        age: 22,
        orders: userToUpdate.orders,
        email: "new email"
      };

      userRepositoryMock.findOne.mockResolvedValue(userToUpdate);
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
      const product: ProductEntity = {
        id: "some-product-id",
        name: "cool product",
        price: 1.00
      }
      const updateUserInput: UpdateUserInput = {
        id: testUserId1,
        age: 22,
        email: "new email",
        orderIds: ["some-product-id"]
      };

      const userToBeUpdated = createOneUser();

      const updatedUser: UserEntity = {
        id: testUserId1,
        name: userToBeUpdated.name,
        age: 22,
        email: "new email",
        orders: [product]
      };

      userRepositoryMock.findOne.mockResolvedValue(userToBeUpdated);
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
