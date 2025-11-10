// src/api/dashboard/db-status.mjs
import { json } from '../../utils/response.mjs';
import { queryDbFirst } from '../../utils/db.mjs';

export const getDbStatus = async (request, env) => {
  try {
    const result = await queryDbFirst(env.DB, "SELECT 1 as status;");

    if (result && result.status === 1) {
      return json({ status: 'ok', message: 'Database connection is healthy.' });
    } else {
      return json({ status: 'error', message: 'Database is not responding correctly.' }, 500);
    }
  } catch (e) {
    console.error("DB status check failed:", e);
    return json({ status: 'error', message: 'Failed to connect to the database.', error: e.message }, 503);
  }
};
