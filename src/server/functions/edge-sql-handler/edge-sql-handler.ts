import EdgeSQLOperations from "./edge-sql-operations";

class EdgeSql {
  private operations: EdgeSQLOperations = EdgeSQLOperations.getInstance();

  get = {
    /**
     * Retrieves the current institution ID for a user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<string | undefined>} The current institution ID of the user.
     */
    currentInstitutionId: this.operations.getCurrentInstitutionId.bind(
      this.operations,
    ),

    /**
     * Checks if the user has the specified roles with access.
     * @param {ServerHasRoleWithAccess} input - The input parameters for checking roles with access.
     * @returns {Promise<boolean>} True if the user has the roles with access, false otherwise.
     */
    hasRolesWithAccess: this.operations.hasRolesWithAccess.bind(
      this.operations,
    ),

    /**
     * Determines if a user is an admin for a given institution.
     * @param {string} userId - The ID of the user.
     * @param {string} institutionId - The ID of the institution.
     * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
     */
    isAdmin: this.operations.isAdmin.bind(this.operations),
  };
}

const edgeSql = new EdgeSql();
export default edgeSql;
