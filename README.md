# SBA-319

# My Application

## Description
This application provides a RESTful API for managing users, posts, and comments. It uses Express for routing and Mongoose for MongoDB database interactions.

## API Routes

### User Routes

- **GET /users**
  - Retrieve all users.

- **GET /users/:id**
  - Retrieve a single user by ID.

- **POST /users**
  - Create a new user.

- **PATCH /users/:id**
  - Update specific fields of an existing user by ID.

- **PUT /users/:id**
  - Update all fields of an existing user by ID.

- **DELETE /users/:id**
  - Delete a user by ID.

### Post Routes

- **GET /posts**
  - Retrieve all posts.

- **GET /posts/:id**
  - Retrieve a single post by ID.

- **POST /posts**
  - Create a new post.

- **PATCH /posts/:id**
  - Update specific fields of an existing post by ID.

- **PUT /posts/:id**
  - Update all fields of an existing post by ID.

- **DELETE /posts/:id**
  - Delete a post by ID.

### Comment Routes

- **GET /comments**
  - Retrieve all comments.

- **GET /comments/:id**
  - Retrieve a single comment by ID.

- **POST /comments**
  - Create a new comment.

- **PATCH /comments/:id**
  - Update specific fields of an existing comment by ID.

- **PUT /comments/:id**
  - Update all fields of an existing comment by ID.

- **DELETE /comments/:id**
  - Delete a comment by ID.

## Middleware Functions
Each resource has a corresponding middleware function to fetch the resource by ID (`getUser`, `getPost`, `getComment`) which is used in routes that require it.

## Setup and Running
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.

The server will be running on [http://localhost:3000](http://localhost:3000).

## Dependencies
- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

