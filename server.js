let express = require('express');
let graphqlHTTP = require('express-graphql');
let { buildSchema } = require('graphql');

let users = [
  {
    id:1,
    name: 'Thomas',
    age: '21',
    gender: 'M'
  },
  {
    id:2,
    name: 'Daniel',
    age: '22',
    gender: 'M'
  },
  {
    id:3,
    name: 'Julius',
    age: '23',
    gender: 'M'
  },
  {
    id:3,
    name: 'Monisa',
    age: '23',
    gender: 'F'
  },
  {
    id:5,
    name: 'Debo',
    age: '25',
    gender: 'F'
  },
  {
    id:6,
    name: 'Alice',
    age: '44',
    gender: 'M'
  },
  {
    id:7,
    name: 'Fatimo',
    age: '25',
    gender: 'F'
  }
]
/*
* =====Type Query
* The exclamation means the ID  must be provided
* Gender is an optional variable
* ====Type Person
* Returns an array of type Person
* ====Type Mutation
* Returns an array of type Person
* */
let schema = buildSchema(`
  type Query {
    user(id: Int!): Person
    users(gender: String): [Person]
  },
  type Person {
    id: Int
    name: String
    age: Int
    gender: String
  },
  type Mutation {
    updateUser(id: Int!, name: String!, age: String): Person
  }
`);

let getUser = function(args) {
  let userID = args.id;
  return users.filter(user => {
    return user.id === userID;
  })[0];
}

let retrieveUsers = function(args) {
  if(args.gender) {
    let gender = args.gender;
    return users.filter(user => user.gender === gender);
  } else {
    return users;
  }
}

let updateUser = function({id, name, age}) {
  users.map(user => {
    if(user.id === id) {
      user.name = name;
      user.age = age;
      return user;
    }
  });
  return users.filter(user=> user.id === id) [0];
}


/*
*
* ====Resolver
* It is responsible for mapping Operation to actual function
* */
let root = {
  user: getUser,
  users: retrieveUsers,
  updateUser: updateUser
};

let app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
