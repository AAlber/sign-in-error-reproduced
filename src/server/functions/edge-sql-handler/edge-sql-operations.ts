import type { Connection } from "@planetscale/database";
import { connect } from "@planetscale/database";
import type { ServerHasRoleWithAccess } from "../../../types/user-management.types";

const config = {
  host: "aws.connect.psdb.cloud",
  username: process.env.PLANETSCALE_DB_USER,
  password: process.env.PLANETSCALE_DB_PASS,
};

class EdgeSQLOperations {
  private static instance: EdgeSQLOperations;
  private conn: Connection;

  constructor() {
    this.conn = connect(config);
  }

  static getInstance() {
    if (!EdgeSQLOperations.instance) {
      EdgeSQLOperations.instance = new EdgeSQLOperations();
    }
    return EdgeSQLOperations.instance;
  }

  async getCurrentInstitutionId(userId: string): Promise<string | undefined> {
    const results = await this.conn.execute(
      `SELECT currentInstitution FROM User WHERE id = ?`,
      [userId],
    );
    return results.rows[0]?.currentInstitution;
  }

  async hasRolesWithAccess(input: ServerHasRoleWithAccess) {
    const count = await this.runHasRolesWithAccessSqlQuery(input);

    if (input.needsAllRoles) {
      const uniqueLayerIds = input.layerIds.filter(
        (value, index, self) => self.indexOf(value) === index,
      );
      return count >= uniqueLayerIds.length;
    }

    return count > 0;
  }

  async runHasRolesWithAccessSqlQuery(input: ServerHasRoleWithAccess) {
    const layerIdsParams = input.layerIds.map(
      (id, index) => `:layerId${index}`,
    );
    const rolesParams = input.rolesWithAccess.map(
      (role, index) => `:role${index}`,
    );

    const query = `
    SELECT COUNT(*)
    FROM Role
    WHERE layerId IN (${layerIdsParams.join(", ")})
    AND userId = :userId
    AND role IN (${rolesParams.join(", ")})
    `;
    const params = input.layerIds.reduce((acc, id, index) => {
      acc[`layerId${index}`] = id;
      return acc;
    }, {});

    params["userId"] = input.userId;

    input.rolesWithAccess.forEach((role, index) => {
      params[`role${index}`] = role;
    });

    const results = await this.conn.execute(query, params);
    return Number(results.rows[0]?.["count(*)"]);
  }

  async isAdmin({
    userId,
    institutionId,
  }: {
    userId: string;
    institutionId: string;
  }) {
    const query = `
    SELECT COUNT(*)
    FROM Role
    WHERE layerId = :layerId
    AND userId = :userId
    AND institutionId = :institutionId
    AND role = :role
    `;

    const params = {
      layerId: institutionId,
      userId: userId,
      institutionId: institutionId,
      role: "admin",
    };

    const results = await this.conn.execute(query, params);
    return Number(results.rows[0]?.["count(*)"]) > 0;
  }
}

export default EdgeSQLOperations;
