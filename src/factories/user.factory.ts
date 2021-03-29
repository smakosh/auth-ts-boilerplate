import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../entity/User';

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);
  const username = faker.internet.userName(firstName, lastName);

  const user = new User();
  user.username = username.toLowerCase();
  user.email = email.toLowerCase();
  // password123
  user.password =
    '$argon2i$v=19$m=4096,t=3,p=1$Y3kjZvA7z1T42u5PYqS0nQ$Ny/57PjPwzHD9ji405y09ReSgqAPkAT3X3LPUcdVne8';
  return user;
});
