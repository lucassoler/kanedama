# Our simple app

Here's a very basic little app (for now, we have big expectations!).

We've been told it is production-ready... but, having a look at the code, we're not quite sure about that.
In fact, we're not even sure it does what we expect: it looks like a bunch of copy/pastes from hello world example.

It's not in production yet so the current API contract can be modified.

Here are the requirements we gave :

## User registration
A user can register with a name, a valid email, a valid password

## User login
A user can login with their email & password, if it's ok, their name will be returned (we said it was a super simple app)

## Business requirements

### User
a user must have a name, an email address, a password
- the name must be alphanumeric charaters, its lenght must be in `[4, 50]`
- the email address must contain alphanumeric charaters, a single `@` symbol, its length is `<` 256
- the password must be alphanumeric charaters, its lenght must be in `[8, 255]`

We expect not to have duplicate names or email addresses among our users

### User registration
If invalid values are received during the registration, we expect in return the list of failed validations

### Errors
You're free to handle errors in the way you consider the best

### Logs
We'd like to have JSON logs outputted in the stdout

### Health check
The `/healthz` endpoint is used to know when its ok to send HTTP traffic to the app (when it responds `200`).

The app will be automatically restarted when it quits (so you don't have to care about this mechanism).

### Start db

```
docker run -e POSTGRES_PASSWORD=password -d -p5432:5432 postgres
```

Just in case you need one. By the way, we don't expect you to dockerize the application. 

# Note to the candidate
"prod-ready" can be a very time-consumming process and we don't expect you to spend too long on this test so
if you think about things that should be done but don't have the time, please write them down in the readme.

### Side note
You heard about hexagonal / clean architecture, TDD, BDD, craftsmanship ?
Show us your skills even if some of these practices seem overkill for such a small app. ;)
