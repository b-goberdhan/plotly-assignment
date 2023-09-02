

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
        products {
            name,
            id,
            price
        }
    }
```