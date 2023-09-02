import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UserService } from '../../src/user/user.service';
import { ProductService } from '../../src/product/product.service';
import { ProductDto } from 'src/product/dto/product.dto';


describe('GraphQL ProductResolver (e2e)', () => {
    let app: INestApplication;
    let productService: ProductService
    let userService: UserService;
    let testProduct1: ProductDto;
    let testProduct2: ProductDto;
    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
  
      userService = moduleFixture.get<UserService>(UserService);
      productService = moduleFixture.get<ProductService>(ProductService);
      
    });
    beforeEach(async () => {
      testProduct1 = await productService.create({
        name: "cool product",
        price: 1.20,
      });
      testProduct2 = await productService.create({
        name: "cool product 2",
        price: 1.96
      });
    });

    describe('/graphql', () => {
      it('should get products', () => {
        return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: '{ products { id price name } }' })
        .expect(200)
        .expect(res => {
          expect(res.body.data.products).toEqual([
            testProduct1,
            testProduct2
          ]);
        });
      });
      
      it('should get specific product', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `{ product(id: "${testProduct1.id}") { id price name } }` })
          .expect(200)
          .expect(res => {
            expect(res.body.data.product).toEqual(testProduct1);
          });
      });

      it('should create a product', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `
            mutation { 
              createProduct(createProductInput: { name: "new product", price: 1.20 }) { 
                id price name 
              } 
            }` 
          })
          .expect(200)
          .expect(res => {
            const newProduct = res.body.data.createProduct;
            expect(newProduct).toEqual(
              expect.objectContaining({
                name: "new product",
                price: 1.20
              })
            );
            expect(newProduct.id).toBeDefined();
          });
      });

      it('should update a product', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `
            mutation { 
              updateProduct(updateProductInput: { id: "${testProduct1.id}", name: "new product", price: 1.21 }) { 
                id,
                price,
                name 
              } 
            }` 
          })
          .expect(200)
          .expect(res => {
            const updatedProduct = res.body.data.updateProduct;
            expect(updatedProduct).toEqual(
              {
                id: testProduct1.id,
                name: "new product",
                price: 1.21
              }
            );
            expect(updatedProduct).not.toEqual(testProduct1);
          });
      });

      it('should remove a product', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `
            mutation { 
              removeProduct(id: "${testProduct1.id}") { 
                 isDeleted
              } 
            }` 
          })
          .expect(200)
          .expect(res => {
            const removedProductResult = res.body.data.removeProduct;
            expect(removedProductResult.isDeleted).toEqual(true);
          });
      });
    });
    
});