import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ProductsService } from '../products/products.service';
import { UserDto } from './dto/user.dto';
import { ProductDto } from '../products/dto/product.dto';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDeletedDto } from './dto/user-deleted.dto';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  
  const userServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };
  
  const productServiceMock = {
    findAllByUserId: jest.fn()
  };

  const createUserDtos = () => ([
    {
      id: 'user-id', 
      name: "name", 
      email: "email",
      age: 20,
      orders: []
    },
    {
      id: 'user-id-2', 
      name: "name-2", 
      email: "email-2",
      age: 22,
      orders: []
    }
  ] as UserDto[]);

  const createOneUserDto = () => createUserDtos()[0] as UserDto;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver, 
        {
          provide: UsersService,
          useValue: userServiceMock
        },
        {
          provide: ProductsService,
          useValue: productServiceMock
        }
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('resolve field', () => {
    it('should resolve orders', async () => {
      const user: UserDto = createOneUserDto();

      const products: ProductDto[] = [
        {
          id: "product-id",
          name: "cool-product",
          price: 10.20
        }
      ];

      productServiceMock.findAllByUserId.mockResolvedValue(products);
      const result = await resolver.orders(user);

      expect(productServiceMock.findAllByUserId).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(products)

    });
  });

  describe('queries', () => {
    it('should find all users', async () => {
      const users: UserDto[] = createUserDtos();

      userServiceMock.findAll.mockResolvedValue(users);
      const result = await resolver.findAll();
      
      expect(userServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should find one user', async () => {
      const user: UserDto = { 
        id: 'user-id', 
        name: "name", 
        email: "email",
        age: 20,
        orders: []
      };

      userServiceMock.findOne.mockResolvedValue(user);
      const result = await resolver.findOne(user.id);
      
      expect(userServiceMock.findOne).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('mutations', () => {
    it("should create a user", async () => {
      const createUserInput: CreateUserInput = {
        name: "user1",
        email: "user@email.com",
        age: 20,
        orderIds: [],
      };

      const userDto: UserDto = {
        id: createOneUserDto().id,
        name: createUserInput.name,
        email: createUserInput.email,
        age: createUserInput.age,
        orders: []
      }

      userServiceMock.create.mockResolvedValue(userDto);

      const result = await resolver.createUser(createUserInput);
      
      expect(userServiceMock.create).toHaveBeenCalledWith(createUserInput);
      expect(result).toEqual(userDto);
    });

    it("should update a user", async () => {
      const updateUserInput: UpdateUserInput = {
        id: "user-id",
        name: "user1",
        email: "user@email.com",
        age: 20,
        orderIds: ["some-product-id"],
      };

      const userDto: UserDto = createOneUserDto();
      const productDto: ProductDto = {
        id: "some-product-id",
        name: "some product",
        price: 1.00
      };
      userDto.orders = [productDto]

      userServiceMock.update.mockResolvedValue(userDto);

      const result = await resolver.updateUser(updateUserInput);
      
      expect(userServiceMock.update).toHaveBeenCalledWith(updateUserInput);
      expect(result).toEqual(userDto);
    });

    it("should remove a user", async () => {
      const userId = "id-to-delete";
      const userDeletedDto: UserDeletedDto = {
        isDeleted: true
      }
      userServiceMock.remove.mockResolvedValue(userDeletedDto)
      const result = await resolver.removeUser(userId);

      expect(userServiceMock.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual(userDeletedDto);

    });
  });
});
