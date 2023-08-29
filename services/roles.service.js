const db = require("./db.service");

// Lấy danh sách các vai trò (roles)
async function getMultipleRoles() {
  const rows = await db.query(
      `SELECT id, name, created_by, created_date, last_modified_by, last_modified_date
    FROM roles`
  );
  return rows;
}

// Tạo mới một vai trò (role)
async function createRole(role) {
  const result = await db.query(
      `INSERT INTO roles 
    (name, created_by, created_date, last_modified_by, last_modified_date) 
    VALUES (?, ?, ?, ?, ?)`,
      [role.name, role.created_by, role.created_date, role.last_modified_by, role.last_modified_date]
  );

  let message = "Error in creating role";

  if (result.affectedRows) {
    message = "Role created successfully";
  }

  return { message };
}

// Cập nhật một vai trò (role) theo ID
async function updateRole(id, role) {
  const result = await db.query(
      `UPDATE roles 
    SET name=?, created_by=?, created_date=?, last_modified_by=?, last_modified_date=?
    WHERE id=?`,
      [role.name, role.created_by, role.created_date, role.last_modified_by, role.last_modified_date, id]
  );

  let message = "Error in updating role";

  if (result.affectedRows) {
    message = "Role updated successfully";
  }

  return { message };
}

// Xóa một vai trò (role) theo ID
async function removeRole(id) {
  const result = await db.query(
      `DELETE FROM roles WHERE id=?`,
      [id]
  );

  let message = "Error in deleting role";

  if (result.affectedRows) {
    message = "Role deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultipleRoles,
  createRole,
  updateRole,
  removeRole,
};