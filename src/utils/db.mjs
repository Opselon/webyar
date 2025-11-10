// src/utils/db.mjs

/**
 * Prepares and runs a D1 database statement.
 * @param {D1Database} db - The D1 database instance from env.DB.
 * @param {string} query - The SQL query string.
 * @param {Array<any>} [params=[]] - Parameters to bind to the query.
 * @returns {Promise<D1Result>}
 */
export async function queryDb(db, query, params = []) {
  if (!db) {
    throw new Error("D1 database not available.");
  }
  const stmt = db.prepare(query).bind(...params);
  return await stmt.all();
}

/**
 * Runs the first row of a D1 database statement.
 * @param {D1Database} db - The D1 database instance from env.DB.
 * @param {string} query - The SQL query string.
 * @param {Array<any>} [params=[]] - Parameters to bind to the query.
 * @returns {Promise<any | null>}
 */
export async function queryDbFirst(db, query, params = []) {
    if (!db) {
        throw new Error("D1 database not available.");
    }
    const stmt = db.prepare(query).bind(...params);
    return await stmt.first();
}

/**
 * Executes a D1 database statement that doesn't return rows (e.g., INSERT, UPDATE, DELETE).
 * @param {D1Database} db - The D1 database instance from env.DB.
 * @param {string} query - The SQL query string.
 * @param {Array<any>} [params=[]] - Parameters to bind to the query.
 * @returns {Promise<D1Result>}
 */
export async function execDb(db, query, params = []) {
    if (!db) {
        throw new Error("D1 database not available.");
    }
    const stmt = db.prepare(query).bind(...params);
    return await stmt.run();
}
