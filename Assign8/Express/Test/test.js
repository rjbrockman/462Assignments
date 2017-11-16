/*Rich Brockman 
* TEST PLAN Assign 8
* ITMD-462
*/
process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should(); 
let expect = chai.expect;
chai.use(chaiHttp);
chai.use(require('chai-json-schema'));

/*
 * Test plan for assignment 8 
 */
/*
 var multiStr = '\nITMD462 Assign8 Test Plan  \n\
This test suite will test the API from Assignment 6/7 \n\n\
============================== \n\
===> Sunny Day test cases <=== \n\
============================== \n\n\
  Test01: Add 3 separate 3 users \n\
           POST /users \n\
  Test02: Add 2 reminders for each of the 3 users \n\
           POST /users/{userId}/reminders \n\
  Test03: Get user informatiin for first 3 users \n\
           GET /users/{userId} \n\
  Test04: Get first and second reminder from second user \n\
           GET /users/{userId}/reminders/{reminderId} \n\
  Test05: Get all reminders from third user \n\
           GET /users/{userId}/reminders \n\
  Test06: Delete first user and all reminders \n\
           DELETE /users/{userId} \n\
  Test07: Delete all reminders from second user \n\
           DELETE /users/{userId}/reminders \n\
  Test08: Delete first reminder from third user \n\
           DELETE /users/{userId}/reminders/{reminderId} \n\n\
======================================== \n\
===> Sunny Day Error Leg test cases <=== \n\
======================================== \n\n\
=>Error leg for route: GET /users/{userId} <= \n\n\
  Test09: Attempt to GET a user that does not exist \n\n\
=>Error legs for route: GET /users/{userId}/reminders <= \n\n\
  Test10: Attempt to GET reminders from a user that does not exist \n\
  Test11: Attempt to GET all reminders from a user that has no reminders \n\n\
=>Error legs for route: GET /users/{userId}/reminders/{reminderid} <=\n\n\
  Test12: Attempt to GET single reminder from a user that does not exist \n\
  Test13: Attempt to GET single reminder from a user that has no reminders \n\
  Test14: Attempt to GET single reminder from a user that does not have that reminder\n\n\
=>Error leg for route: POST /users <= \n\n\
  Test15: Attempt to add a user with empty body \n\n\
=>Error legs for route: POST /users/{userid}/reminders <= \n\n\
  Test16: Attempt to add a reminder to a user that does not exist \n\
  Test17: Attempt to add a user with empty body \n\n\
=>Error leg for route: DELETE /users/{userid} <= \n\n\
  Test18: Attempt to DELETE a user that does not exist \n\n\
=>Error leg for route: DELETE /users/{userid}/reminders <= \n\n\
  Test19: Attempt to DELETE all reminders from a user that does not exist \n\
  Test20: Attempt to DELETE all reminders from a user that does not have reminders \n\n\
=>Error leg for route: DELETE /users/{userid}/reminders/{reminderid} <= \n\n\
  Test21: Attempt to DELETE a single reminder from a user that does not exist \n\
  Test22: Attempt to DELETE a single reminder that does not have that reminder \n\
  Test23: Attempt to DELETE a single reminder from a user that does not have reminders \n\n\
=>Error leg for bad route: <= \n\n\
  Test24: Attempt an invalid route \n\n\n\
##### BEGIN TESTING ##### '; 
console.log(multiStr);
*/
/*
 *  Test01: Add 3 separate 3 users POST /users
 */
describe('Test01: Add 3 users \n\troute: POST /users', () => {

  let user1 = { 'user': {'name': 'Jim Tom', 'email': 'jimtom@gmail.com'}};
  let user2 = { 'user': {'name': 'Joe Cool', 'email': 'jcool@gmail.com'}}; 
  let user3 = { 'user': {'name': 'Goldy Locks', 'email': 'glocks@gmail.com'}};

  it('Add user 1', (done) => {
      chai.request(server)
      .post('/users/')
      .send(user1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id').eql(1);
        done();
    });
   });
  

  it('Add user 2', (done) => {
      chai.request(server)
      .post('/users/')
      .send(user2)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id').eql(2);
        done();
    });
  });
  
  it('Add user 3', (done) => {
      chai.request(server)
      .post('/users/')
      .send(user3)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id').eql(3);
        done();
    });
  }); 
}); 

/*
 *  Test02: Add 2 reminders for each of the 3 users POST /users/{userId}/reminders
 */
describe('Test02: Add 2 reminders to each of the 3 users \n\troute: POST /users/{userId}/reminders', () => {

  let userid1 = 1;
  let user1Reminder1 = { 'reminder': {'title': 'trip01',  'description': 'chicago to dallas'}};
  let user1Reminder2 = { 'reminder': {'title': 'trip02',  'description': 'dallas to chicago'}};
  let userid2 = 2;
  let user2Reminder1 = { 'reminder': {'title': 'drive01',  'description': 'chicago to rockford'}};
  let user2Reminder2 = { 'reminder': {'title': 'drive02',  'description': 'rockford to chicago'}};
  let userid3 = 3;
  let user3Reminder1 = { 'reminder': {'title': 'train01',  'description': 'joliet to chicago'}};
  let user3Reminder2 = { 'reminder': {'title': 'train02',  'description': 'chicago to joliet'}}; 
            
  it('Add reminder 1 to user 1', (done) => {
    chai.request(server)
      .post('/users/' + userid1 + '/reminders')
      .send(user1Reminder1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('reminderid').eql(1);
        done()
    });
  });   

  it('Add reminder 2 to user 1', (done) => {
    chai.request(server)
      .post('/users/' + userid1 + '/reminders')
      .send(user1Reminder2)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('reminderid').eql(2);
        done();
    });
  });


  it('Add reminder 1 to user 2', (done) => {
    chai.request(server)
      .post('/users/' + userid2 + '/reminders')
      .send(user2Reminder1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('reminderid').eql(1);
        done();
    });  
  });

  it('Add reminder 2 to user 2', (done) => {
    chai.request(server)
      .post('/users/' + userid2 + '/reminders')
      .send(user2Reminder2)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('reminderid').eql(2);
        done();
    });
  });

  it('Add reminder 1 to user 3', (done) => {
    chai.request(server)
      .post('/users/' + userid3 + '/reminders')
      .send(user3Reminder1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('reminderid').eql(1);
        done();
    });
  });

  it('Add reminder 2 to user 3', (done) => {
    chai.request(server)
      .post('/users/' + userid3 + '/reminders')
      .send(user3Reminder2)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('reminderid').eql(2)
        done();
    });
  }); 
});

/*
 *  Test03: Get user information for first 3 users GET /users/{userId} 
 */
describe('Test03: Get user information for first 3 users \n\troute: GET /users/{userid}', () => {

  let userid1 = 1; 
  let userid2 = 2; 
  let userid3 = 3;

  var userSchema = {
    title: 'Assignment 8 user output schema',
    type: 'object',
    required: ['name', 'email'],
    properties: {
        name: {type: 'string'},
        email: {type:'string'}
    }
  }
  
  it('Get the name and email of user 1', (done) => {
    chai.request(server)
      .get('/users/' + userid1)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.jsonSchema(userSchema);
        res.body.should.have.property('name').eql('Jim Tom');
        res.body.should.have.property('email').eql('jimtom@gmail.com');
        done();
    });
  });

  it('Get the name and email of user 2', (done) => {
    chai.request(server)
      .get('/users/' + userid2)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('name').eql('Joe Cool');
        res.body.should.have.property('email').eql('jcool@gmail.com');
        done();
    });
  });

  it('Get the name and email of user 3', (done) => {
    chai.request(server)
      .get('/users/' + userid3)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('name').eql('Goldy Locks');
        res.body.should.have.property('email').eql('glocks@gmail.com');
        done();
    });
  });
});

/*
 *  Test04: Get first and second reminder from second user
 *            GET /users/{userId}/reminders/{reminderId}
 */
describe('Test04: Get first and second reminder from user 2 \n\troute: GET /users/{userid}/reminders/{reminderid}', () => {

  let userid = 1; 
  let reminderid1 = 1;
  let reminderid2 = 2; 
    
  var reminderSchema = {
      title: 'Assignment 8 reminder output schema',
      type: 'object',
      required: ['title', 'description', 'created'],
      properties: {
          title: {type: 'string'},
          description: {type:'string'},
          created: {type: 'string'}
      }
  }

  it('Get first reminder from second user', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/' + reminderid1)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.jsonSchema(reminderSchema);
        res.body.should.have.property('title').eql('trip01');
        res.body.should.have.property('description').eql('chicago to dallas');
        // created field implicitly tested as string in jsonSchema check
        done();
    });
  });


  it('Get second reminder from second user', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/' + reminderid2)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.jsonSchema(reminderSchema);
        res.body.should.have.property('title').eql('trip02');
        res.body.should.have.property('description').eql('dallas to chicago');
        // created field implicitly tested as string in jsonSchema check
        done();
    });      
  });
});

/*
 *  Test05: Get all reminders from third user 
 *          GET /users/{userId}/reminders 
 */
describe('Test05: Get all reminders from user 3 \n\troute: GET /users/{userid}/reminders', () => {

  let userid = 3;
    
  it('Get all reminders from second user', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.length(2);
        done();
    });
  });
});

/* 
 * Test06: Delete first user and all reminders
 *         DELETE /users/{userId}
 */
describe('Test06: Delete first user and all reminders \n\troute: DELETE /users/{userid}', () => {

  let userid = 1;
    
  it('Delete first user and reminders', (done) => {
    chai.request(server)
      .delete('/users/' + userid)
      .end((err, res) => {
        res.should.have.status(204);
        done();
    });
  });
});

/* 
 * Test07: Delete all reminders from second user 
 *          DELETE /users/{userId}/reminders 
 */
describe('Test07: Delete all reminders from second user \n\troute: DELETE /users/{userid}/reminders', () => {

  let userid = 2;
    
  it('Delete all reminders from user 2', (done) => {
    chai.request(server)
      .delete('/users/' + userid + '/reminders')
      .end((err, res) => {
        res.should.have.status(204);
        done();
    });
  });
});

/* 
 * Test08: Delete first reminder from third user
 *          DELETE /users/{userId}/reminders/{reminderId}
 */
describe('Test08: Delete first reminder from third user \n\troute: DELETE /users/{userId}/reminders/{reminderId}', () => {

  let userid = 3;
  let reminderid = 1;

  it('Delete reminder 1 from user 3', (done) => {
    chai.request(server)
      .delete('/users/' + userid + '/reminders/' + reminderid)
      .end((err, res) => {
        res.should.have.status(204);
        done();
    });
  });
});

/*
 * Test09: Attempt to GET a user that does not exist
 *          GET /users/{userId} 
 */
describe('Test09: Attempt to GET a user that does not exist \n\troute: GET /users/{userid}', () => {

  let userid1 = 1; 

  it('Attempt to get name and email from deleted user 1', (done) => {
    chai.request(server)
      .get('/users/' + userid1)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 1 was not found');
        done();
    });
  });
});

/*
 * Test10: Attempt to GET reminders from a user that does not exist
 *          GET /users/{userId}/reminders 
 */
describe('Test10: Attempt to GET all reminders from a user that does not exist \n\troute: GET /users/{userid}/reminders', () => {

  let userid = 1;
    
  it('Attempt to get all reminders from user 1 (user was deleted by Test06)', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 1 was not found');
        done();
    });
  });
});

/*
 * Test11: Attempt to GET all reminders from a user that has no reminders
 *          GET /users/{userId}/reminders 
 */
describe('Test11: Get all reminders from a user that has no reminders \n\troute: GET /users/{userid}/reminders', () => {

  let userid = 2;
    
  it('Attempt to get all reminders from user 2 (reminders were deleted by Test07)', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 2 has no reminders');
        done();
    });
  });
});

/*
 * Test12: Attempt to GET single reminder from a user that does not exist
 *          GET /users/{userId}/reminders/{reminderId} 
 */
describe('Test12: Get a reminders from a user that does not exist \n\troute: GET /users/{userid}/reminders/{reminderid}', () => {

  let userid = 1;
  let reminderid  = 1;
    
  it('Attempt to get reminder 1 from user 1 (user was deleted by Test06)', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/' + reminderid)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 1 was not found');
        done();
    });
  });
});

/*
 * Test13 Attempot to GET single reminder from a user that has no reminders n\
 *         GET /users/{userId}/reminders/{reminderId}
 */
describe('Test13: Get a reminders from a user that has no reminders \n\troute: GET /users/{userid}/reminders/{reminderid}', () => {

  let userid = 2;
  let reminderid  = 1;
    
  it('Attempt to get reminder 1 from user 2 (reminders were deleted by Test07)', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/' + reminderid)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 2 has no reminders');
        done();
    });
  });
});

/*
 * Test14 Attempot to GET single reminder from a user that does not have that reminder\n\
 *          GET /users/{userId}/reminders/{reminderId} 
 */
describe('Test14: Get a reminders from a user that does not have that reminder \n\troute: GET /users/{userid}/reminders/{reminderid}', () => {

  let userid = 3;
  let reminderid  = 1;
    
  it('Attempt to get reminder 1 from user 3 (reminder 1 were deleted by Test08)', (done) => {
    chai.request(server)
      .get('/users/' + userid + '/reminders/' + reminderid)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, reminderid 1 was not found');
        done();
    });
  });
});

/*
 * Test15: Attempt to POST a user with empty body
 *          POST /users 
 */
describe('Test15: Attempt add user with empty body \n\troute: POST /users', () => {

  let tmpUser = { };

  it('Attempt to add user', (done) => {
      chai.request(server)
      .post('/users/')
      .send(tmpUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.equal('Error: Data required for this operation');
        done();
    });
  });
});

/*
 * Test16: Attempt to add a reminder to a user that does not exist
 *          POST /users/{userid}/reminders 
 */
describe('Test16: Attempt to add reminder to user that does not exist\n\troute: POST /users/{userid}/reminders', () => {

  let userid = 4;
  let user4Reminder1 = { 'reminder': {'title': 'trip01',  'description': 'chicago to dallas'}};

  it('Attempt to add a reminder to user 4', (done) => {
      chai.request(server)
      .post('/users/' + userid + '/reminders')
      .send(user4Reminder1)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 4 was not found');
        done();
    });
  });
});

/*
 * Test17: Attempt to add a user with empty body
 *          POST /users/{userid}/reminders
 */
describe('Test17: Attempt add user 2 with empty body \n\troute: POST /users/{userid}/reminders', () => {

  let userid = 2;
  let user2Reminder1 = { };

  it('Attempt to add reminder to user 2', (done) => {
      chai.request(server)
      .post('/users/' + userid + '/reminders')
      .send(user2Reminder1)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.equal('Error: Data required for this operation');
        done();
    });
  });
});

/* 
 * Test18: Attempt to DELETE a user that does not exist
 *          DELETE /users/{userId}
 */
describe('Test18: Attempt to DELETE a user that does not exist \n\troute: DELETE /users/{userid}', () => {

  let userid = 4;
    
  it('Delete user 4', (done) => {
    chai.request(server)
      .delete('/users/' + userid)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 4 was not found');
        done();
    });
  });
});

/* 
 * Test19: Attempt to DELETE all reminders from a user that does not exist
 *          DELETE /users/{userId}/reminders
 */
describe('Test19: Attempt to DELETE all reminders from a user that does not exist \n\troute: DELETE /users/{userid}/reminders', () => {

  let userid = 4;
      
  it('Delete user 4', (done) => {
    chai.request(server)
      .delete('/users/' + userid + '/reminders')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 4 was not found');
        done();
    });
  });
});

/* 
 * Test20: Attempt to DELETE all reminders from a user that does not have reminders.
 *          DELETE /users/{userId}/reminders
 */
describe('Test20: Attempt to DELETE all reminders from a user that does not have reminders \n\troute: DELETE /users/{userid}/reminders', () => {

  let userid = 2;
      
  it('Attempt to delete all reminders from user 2', (done) => {
    chai.request(server)
      .delete('/users/' + userid + '/reminders')
      .end((err, res) => {
        res.should.have.status(204);
        done();
    });
  });
});

/* 
 * Test21: Attempt to DELETE a single reminder from a user that does not exist.
 *          DELETE /users/{userId}/reminders/{remindersid}
 */
describe('Test21: Attempt to DELETE a single reminder from a user that does not exist \n\troute: DELETE /users/{userid}/reminders/{reminderid}', () => {

  let userid = 4;
  let reminderid = 1;
      
  it('Attempt to delete reminder 1 from user 4', (done) => {
    chai.request(server)
      .delete('/users/' + userid + '/reminders/' + reminderid)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, userid 4 was not found');
        done();
    });
  });
});

/* 
 * Test22: Attempt to DELETE a single reminder that does not have that reminder.
 *          DELETE /users/{userId}/reminders/{remindersid}
 */
describe('Test22: Attempt to DELETE a single reminder that does not have that reminder. \n\troute: DELETE /users/{userid}/reminders/{reminderid}', () => {

  let userid = 3;
  let reminderid = 8;
      
  it('Attempt to delete reminder 8 from user 3', (done) => {
    chai.request(server)
      .delete('/users/' + userid + '/reminders/' + reminderid)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, reminderid 8 was not found');
        done();
    });
  });
});

/* 
 * Test23: Attempt to DELETE a single reminder from a user that does not have reminders.
 *          DELETE /users/{userId}/reminders/{reminderid}
 */
describe('Test23: Attempt to DELETE a single reminder from a user that does not have reminders. \n\troute: DELETE /users/{userid}/reminders/{reminderid}', () => {

  let userid = 2;
  let reminderid = 1;

  it('Attempt to delete reminders 1 from user 2', (done) => {
    chai.request(server)
      .delete('/users/' + userid + '/reminders/' + reminderid)
      .end((err, res) => {
        res.should.have.status(204);
        done();
    });
  });
}); 

/* 
 * Test24: Attempt an invalid route.
 */
describe('Test24: Attempt to access and invalid resource.', () => {
  it('Attempt an invalid route', (done) => {
    chai.request(server)
      .delete('/users1/')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.equal('Sorry, Can not find that resource.');
        done();
    });
  });
}); 