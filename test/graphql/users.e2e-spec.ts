import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/users/users.service';
import { UserDto } from '../../src/users/dto/user.dto';
import { ProductsService } from '../../src/products/products.service';
import { ProductDto } from 'src/products/dto/product.dto';

describe('GraphQL UsersResolver (e2e)', () => {
  let app: INestApplication;
  let userService: UsersService;
  let productService: ProductsService
  let testUser: UserDto;
  let testProduct: ProductDto;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<UsersService>(UsersService);
    productService = moduleFixture.get<ProductsService>(ProductsService);
    
  });

  beforeEach(async () => {
    testUser = await userService.create({
      name: "cool user",
      age: 20,
      email: "cool email",
      orderIds: []
    });
    
    testProduct = await productService.create({
      name: "cool product",
      price: 1.20,
    })
  });

  describe('/graphql', () => {
    it('should get users', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: '{ users { id name email age orders { id }} }' })
        .expect(200)
        .expect(res => {
          expect(res.body.data.users).toEqual([{
            ...testUser,
            orders: []
          }]);
        });
    });

    it('should get a specific user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: `
          { 
            user(id: "${testUser.id}") 
            { 
              id 
              name 
              email 
              age 
              orders { 
                id 
              } 
            } 
          }` 
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.user).toEqual({
            ...testUser,
            orders: []
          });
        });
    });

    it('create a user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: 
          `mutation {
            createUser(createUserInput: { name: "name", email: "email@com", age: 21 }) {
              id,
              name,
              email,
              age
              orders {
                name,
                price,
                id
              }
            }
          }` 
        })
        .expect(200)
        .expect(res => {
          const newUser = res.body.data.createUser;
          expect(newUser).toEqual(expect.objectContaining({
            age: 21,
            email: "email@com",
            name: "name",
            orders: []
          }));
          expect(newUser.id).toBeDefined();
        });
    });

    describe("update user", () => {
      it('update a user', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: 
            `mutation {
              updateUser(updateUserInput: { id: "${testUser.id}", name: "name", email: "email@com", age: 21 }) {
                id,
                name,
                email,
                age
              }
            }` 
          })
          .expect(200)
          .expect(res => {
            const updatedUser = res.body.data.updateUser;
            expect(updatedUser).toEqual({
              id: testUser.id,
              age: 21,
              email: "email@com",
              name: "name",
            });
          });
      });
      it('update user orders', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: 
            `mutation {
              updateUser(updateUserInput: { id: "${testUser.id}", name: "name", email: "email@com", age: 21, orderIds: ["${testProduct.id}"] }) {
                id,
                name,
                email,
                age,
                orders {
                  id,
                  name,
                  price
                }
              }
            }` 
          })
          .expect(200)
          .expect(res => {
            const updatedUser = res.body.data.updateUser;
            expect(updatedUser).toEqual({
              id: testUser.id,
              age: 21,
              email: "email@com",
              name: "name",
              orders: [{ ...testProduct }]
            });
          });
      });
    });
    
    it("can remove a user", async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: 
          `mutation {
            removeUser(id: "${testUser.id}") {
              isDeleted
            }
          }` 
        })
        .expect(200)
        .expect(res => {
          const removeUser = res.body.data.removeUser;
          expect(removeUser.isDeleted).toBe(true);
        });
    });
  });
  
});
