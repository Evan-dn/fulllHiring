module.exports = {
  // Step 1 — in-memory repos, all scenarios
  default: {
    paths: ['features/**/*.feature'],
    require: ['features/support/**/*.ts'],
    requireModule: ['ts-node/register'],
  },
  // Step 2 — SQLite repos, @critical scenarios only
  sql: {
    paths: ['features/**/*.feature'],
    require: ['features/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    tags: '@critical',
    worldParameters: { useDb: true },
  },
};
