import fs from "fs";

type SessionMap = {
  token: string;
  userId: string;
  clientIp: string;
};

export function loadSessionMap(path: string): SessionMap[] {
  const sessionMap: SessionMap[] = [];
  try {
    const rows = fs.readFileSync(path, "utf8").toString().split("\n");
    for (let i = 1; i < rows.length; i++) {
      // Skip the header
      const row = rows[i];
      const [token, userId, clientIp] = row.split("\t");
      sessionMap.push({
        token,
        userId,
        clientIp,
      });
    }
  } catch (e) {
    ngx.log(ngx.ERR, `[Error] Failed to load session map from ${path} (${e})`);
  }
  return sessionMap;
}

export function appendSessionMap(path: string, sessionMap: SessionMap): void {
  try {
    fs.appendFileSync(path, `${sessionMap.token}\t${sessionMap.userId}\t${sessionMap.clientIp}\n`);
  } catch (e) {
    ngx.log(ngx.ERR, `[Error] Failed to append session map to ${path} (${e})`);
  }
}

export function writeSessionMap(path: string, sessionMaps: SessionMap[]): void{
  try {
    const rows = sessionMaps.map(sessionMap => `${sessionMap.token}\t${sessionMap.userId}\t${sessionMap.clientIp}`);
    fs.appendFileSync(path, 'token\tuserId\tclientIp\n' + rows.join("\n"));
  } catch (e) {
    ngx.log(ngx.ERR, `[Error] Failed to write session map to ${path} (${e})`);
  }
}

export function findUserBySession(sessionMap: SessionMap[], token: string): SessionMap | undefined {
  return sessionMap.find(sessionMap => sessionMap.token === token);
}
