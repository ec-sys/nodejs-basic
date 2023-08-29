const db = require("./db.service");
const paging = require("../paging.helper");
const config = require("../config");

async function getMultipleUser(page =1){
  const offset = paging.getOffset(page,config.listPerPage);
  const rows = await db.query(
      `SELECT id, login_id, email, last_name,first_name, address,phone_number
    FROM users LIMIT ${offset},${config.listPerPage}`)
  const data = paging.emptyOrRows(rows);
  const meta = {page};
  return{
    data,
    meta,
  };
}

async function createUser(user) {
  const result = await db.query(
      `INSERT INTO users 
    (login_id, password, email, last_name, first_name, birth_date, 
    address, phone_number, created_by, created_date, last_modified_by, last_modified_date) 
    VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.login_id,
        user.password,
        user.email,
        user.last_name,
        user.first_name,
        user.birth_date,
        user.address,
        user.phone_number,
        user.created_by,
        user.created_date,
        user.last_modified_by,
        user.last_modified_date,
      ]
  );

  let message = "Error in creating user";

  if (result.affectedRows) {
    message = "User created successfully";
  }

  return { message };
}

async function updateUser(id, user) {
  const result = await db.query(
      `UPDATE users 
    SET login_id=?, password=?, email=?, last_name=?, first_name=?, 
    birth_date=?, address=?, phone_number=?, created_by=?, created_date=?, 
    last_modified_by=?, last_modified_date=?
    WHERE id=?`,
      [
        user.login_id,
        user.password,
        user.email,
        user.last_name,
        user.first_name,
        user.birth_date,
        user.address,
        user.phone_number,
        user.created_by,
        user.created_date,
        user.last_modified_by,
        user.last_modified_date,
        id,
      ]
  );

  let message = "Error in updating user";

  if (result.affectedRows) {
    message = "User updated successfully";
  }

  return {message};
}

module.exports={
  getMultipleUser,
  createUser,
  updateUser,
};