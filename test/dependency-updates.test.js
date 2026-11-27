const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(
  fs.readFileSync(path.join(root, "package-lock.json"), "utf8")
);

// Small semver helper: only needs to compare simple versions/ranges used in
// this repository, e.g. "^2.2.3", "~1.2.3", ">=1.41.1" or "1.81.0".
function minimumVersion(range) {
  const match = String(range).match(/(\d+)\.(\d+)\.(\d+)/);
  assert.ok(match, `could not read a version from "${range}"`);
  return match.slice(1).map(Number);
}

function atLeast(actual, minimum) {
  const a = minimumVersion(actual);
  const b = minimumVersion(minimum);
  for (let i = 0; i < 3; i += 1) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return true;
}

function lockedVersion(name) {
  const entry = lock.packages[`node_modules/${name}`];
  assert.ok(entry, `${name} is missing from package-lock.json`);
  return entry.version;
}

test("@upstash/ratelimit requires @upstash/redis 1.41.1 or newer", () => {
  assert.ok(
    atLeast(pkg.dependencies["@upstash/ratelimit"], "2.2.3"),
    `@upstash/ratelimit must be at least 2.2.3, got ${pkg.dependencies["@upstash/ratelimit"]}`
  );

  // @upstash/ratelimit 2.2.3 declares @upstash/redis ^1.41.1 as a peer, so the
  // direct dependency and the locked install must both satisfy that floor.
  assert.ok(
    atLeast(pkg.dependencies["@upstash/redis"], "1.41.1"),
    `@upstash/redis must be at least 1.41.1, got ${pkg.dependencies["@upstash/redis"]}`
  );
  assert.ok(
    atLeast(lockedVersion("@upstash/redis"), "1.41.1"),
    `locked @upstash/redis must be at least 1.41.1, got ${lockedVersion("@upstash/redis")}`
  );

  const ratelimit = lock.packages["node_modules/@upstash/ratelimit"];
  assert.ok(ratelimit, "@upstash/ratelimit is missing from package-lock.json");
  assert.ok(
    atLeast(ratelimit.peerDependencies["@upstash/redis"], "1.41.1"),
    `locked @upstash/ratelimit peer must require 1.41.1 or newer, got ${ratelimit.peerDependencies["@upstash/redis"]}`
  );
});

test("lucide-react is on 1.81.0 or newer", () => {
  assert.ok(
    atLeast(pkg.dependencies["lucide-react"], "1.81.0"),
    `lucide-react must be at least 1.81.0, got ${pkg.dependencies["lucide-react"]}`
  );
  assert.ok(
    atLeast(lockedVersion("lucide-react"), "1.81.0"),
    `locked lucide-react must be at least 1.81.0, got ${lockedVersion("lucide-react")}`
  );
});
