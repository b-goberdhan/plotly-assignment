# GraphQL Api Docs

## Mutations

### Creating a user without associating it with any orders
```graphql
mutation {
  createUser(createUserInput: { name: "brandon", email: "sdsdsd@email.com", age: 21 }) {
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
}

```
#### Exected Result

```json
{
  "data": {
    "createUser": {
      "id": "65bc52e4-1511-4367-b96a-136c90e9a425",
      "name": "brandon",
      "email": "sdsdsd@email.com",
      "age": 21,
      "orders": []
    }
  }
}
```

### Creating a user and associating it with orders
> Note that the order must have been created prior
```graphql
mutation {
  createUser(createUserInput: { name: "name", email: "sdsdsd@email.com", age: 21, orderIds: "<guid-from-existing-product>" }) {
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
}
```

#### Expected Result

```json
  "createUser": {
    "id": "10a839bc-f8c8-4248-83ae-67b08d5c1e73",
    "name": "name",
    "email": "sdsdsd@email.com",
    "age": 21,
    "orders": [
      {
        "name": "fancy-new-product",
        "price": 1.2,
        "id": "07e59f7a-bd31-41d4-b365-68cab64d3d73"
      }
    ]
  },
```

### Updating a user, changing thier email (you can still retrieve all properties of users here, I just ommited it for breveity)

```graphql
mutation {
  updateUser(updateUserInput: { id: "<id-of-existing-user>", email: "new@email.com"}) {
    id,
    email,
  }
}
```

#### Expected Result
```json
{
  "data": {
    "updateUser": {
      "id": "10a839bc-f8c8-4248-83ae-67b08d5c1e73",
      "email": "new@email.com"
    }
  }
}
```

### Updating a user, updating thier orders (you can still retrieve all properties of users here, I just ommited it for breveity)

```graphql
mutation {
  updateUser(updateUserInput: { id: "<id-of-existing-user>", orderIds: ["existing-product-id"]) {
    id,
    orders {
      id,
      name,
      price
    }
  }
}
```

#### Expected Result

```json
{
  "data": {
    "updateUser": {
      "id": "10a839bc-f8c8-4248-83ae-67b08d5c1e73",
      "orders": [{
        "id": "existing-product-id",
        "name": "some-product",
        "price": 1.20
      }]
    }
  }
}
```
> Note setting the orderIds to [] will remove the orders associated with the user.

### Removing a User

```graphql
  mutation {
    removeUser(id: "<id-of-existing-user>") {
      isDeleted
    }
  }
```

#### Expected Result

```json
{
  "data": {
    "removeUser": {
      "isDeleted": true // may be false if entity did not exist prior
    }
  }
}
```

### Creating a product

```graphql
mutation {
  createProduct(createProductInput: { name: "new-product", price: 1.20 }) {
    id,
    name,
    price
  }
}
```

#### Expected Result

```json
{
  "data": {
    "createProduct": {
      "id": "f75f9859-d720-4c10-b8d8-b7667a7c9d1e",
      "name": "new-product",
      "price": 1.2
    }
  }
}
```

### Updating a product

```graphql
  mutatations {
    updateProduct(updateProductInput: { id: "<guid-of-existing-product>", name: "new" }) {
      id,
      name,
      price
    }
  }
  
```

#### Expected Result

```json
{
  "data": {
    "updateProduct": {
      "id": "fda3ca7a-b8d5-45cc-bb05-de81fd1909d7",
      "name": "new",
      "price": 1.2
    }
  }
}
```

### Removing a product 

```graphql
mutation {
  removeProduct(id: "4bf3371f-5e3b-40ed-abc0-b0ab80658a30") {
    isDeleted
  }
}
```

#### Expected result 

```json
{
  "data": {
    "removeProduct": {
      "isDeleted": true // may be false if entity did not exist prior
    }
  }
}
```

## Queries

### Query All Users and thier orders (if they are associated with an order)

```graphql
    query {
      users {
        id,
        name,
        email
        orders {
          id,
          name,
          price
        }
      }
    }
```

#### Expected Result

```json
  {
  "data": {
    "users": [
      {
        "id": "501b0322-9534-423f-a61e-7d056546633d",
        "name": "name1",
        "email": "sdsdsd@1email.com",
        "orders": [
          {
            "id": "4bf3371f-5e3b-40ed-abc0-b0ab80658a30",
            "name": "newer product",
            "price": 1.2
          }
        ]
      },
      {
        "id": "e5d4c1ed-3b16-4eef-b755-c8b6f6b7cef1",
        "name": "name2",
        "email": "sdsdsd@2email.com",
        "orders": []
      },
      {
        "id": "67673cf5-bbcf-4f73-8b6a-b397522ea143",
        "name": "name3",
        "email": "sdsdsd@3email.com",
        "orders": []
      }
    ]
  }
}
```

### Query a user by id

```graphql
  query {
    user(id: "501b0322-9534-423f-a61e-7d056546633d") {
    id,
    name,
    email,
    orders {
      id
      name,
      price
  	}
 }
```

#### Expected Result

```json
{
  "data": {
    "user": {
      "id": "501b0322-9534-423f-a61e-7d056546633d",
      "name": "name",
      "email": "sdsdsd",
      "orders": [
        {
          "id": "4bf3371f-5e3b-40ed-abc0-b0ab80658a30",
          "name": "newer product",
          "price": 1.2
        }
      ]
    }
  }
}
```
> Note in this case, the user had orders, if they didnt, the list would be empty

### Query All Products 

```graphql
query {
  products {
    name,
    id,
    price
  }
}
```

#### Expected Result

```json
{
  "data": {
    "products": [
      {
        "name": "new1",
        "id": "ca40224a-4b30-4b3e-8995-e9d2bb50bb69",
        "price": 1.21
      },
      {
        "name": "new2",
        "id": "fda3ca7a-b8d5-45cc-bb05-de81fd1909d7",
        "price": 1.2
      },
      {
        "name": "new3",
        "id": "4bf3371f-5e3b-40ed-abc0-b0ab80658a30",
        "price": 1.24
      },
      {
        "name": "new4",
        "id": "2da2853f-09d2-4d8d-b64f-11b98216d126",
        "price": 1.25
      }
    ]
  }
}
```


### Query product by id

```graphql
query {
  product(id: "ca40224a-4b30-4b3e-8995-e9d2bb50bb69") {
    name,
    price
  }
}
```

#### Expected Results

```json
{
  "data": {
    "product": {
      "name": "newer product product dawg1",
      "price": 1.20
    }
  }
}
```

