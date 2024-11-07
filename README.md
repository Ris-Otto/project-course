## Backend

```
cd api
deno task start    
```

### Conventions

Sequelize API for database communication https://sequelize.org/docs/v6/

Sequelize provides shorthand for linking one table to another through a simple function call.

To use this functionality a property must be declared on the object:

```
class User extends Model {
...
declare Venues: Venue[];
-> declare addVenue: (venueId: string) => Promise<VenueFollowing | null>;
```

Using the `addVenue` method links a user to a venue through `VenueFollowing`. The return value doesn't need to be correct for the function to work, only the signature of the function. The in-parameter can be an object (eg. `Venue`) or the primary key of the row to link to.

A series of shorthands for including associated tables in a query has been provided in `api/Database/framework.js`. Example usage of these can be found in `ArtistController.ts`. The shorthands are rudimentary and open to expansion.

The API currently doens't separate routers, controllers and services; everything is bundled into a `{name}Controller.ts`. As the application grows and data processing and filtering becomes more complex this might need to change.

The communication between the client and server is handled by `Shared/Result.ts`. All successful communication returns a 200 OK HTTP-response and any problems that have occured are stored in `Result.message` and `Result.resultCode`. 
Communications where the API throws return a 500 Internal Server Error HTTP-response.

A number of shorthands for creating an object reponse are provided in `Result.ts`.

Authentication occurs in `authController` and `JWTMiddleware`. Exported members `verifyIsUser`, `verifyIsBand` and `verifyIsVenue` are used in their respective controllers for privileged access.

All database tables are declared 'code-first', and all columns are found in their respective file under `api/Database/Model`. Some fields, like `createdAt` and `updatedAt` are omitted and provided by sequelize. These can be omitted in the database from the model declaration as well, if need be.

All references to other database models within a model declaration are virtual by nature. Same with any declared class-methods.

Note: A custom logger is implemented, but is poorly optimised and should not be used. For nested objects it exceeds the call-stack limit :) Use console.log with JSON.stringify instead.

### Testability
- example 1

###

### example.env
```
MYSQL_HOST=example.host.xyz
MYSQL_PORT=1111 (mysql default 3306)
MYSQL_USER=exampleusername
MYSQL_PASSWORD=examplepassword

ORIGIN=https://www.example.abc

JWT_SECRET=very_secret_key_super_long_maybe_key
JWT_EXP=time_from_token_creation_until_token_expiration_in_seconds
```

## Frontend

```
cd front
deno task dev
```

### Conventions

### Testability
- example 1

#### HTML-Element metadata
Required for input:
- id
- example 2

Required for clickables
- id
- example 3


