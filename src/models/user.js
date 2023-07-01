export default class User {
  constructor(
    username,
    email,
    password,
    oldPassword,
    active,
    rolesDto,
    employeeId
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.oldPassword = oldPassword;
    this.active = active;
    this.rolesDto = rolesDto;
    this.employeeId = employeeId;
  }
}
