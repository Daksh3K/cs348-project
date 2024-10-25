PrismaClientInitializationError: 
Invalid `prisma.hello_world.findFirst()` invocation:


error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
  -->  schema.prisma:7
   | 
 6 |   provider = "cockroachdb"
 7 |   url      = env("DATABASE_URL")
   | 

Validation Error Count: 1
    at _n.handleRequestError (/var/task/node_modules/@prisma/client/runtime/library.js:121:8049)
    at _n.handleAndLogRequestError (/var/task/node_modules/@prisma/client/runtime/library.js:121:7057)
    at _n.request (/var/task/node_modules/@prisma/client/runtime/library.js:121:6741)
    at async l (/var/task/node_modules/@prisma/client/runtime/library.js:130:9355)
    at async s (/var/task/.next/server/app/hello/page.js:2:57580)
    at async /var/task/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:16:418
    at async rR (/var/task/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:15:7978)
    at async r7 (/var/task/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:18:1144)
    at async es (/var/task/node_modules/next/dist/compiled/next-server/server.runtime.prod.js:16:26324)
    at async en.responseCache.get.routeKind (/var/task/node_modules/next/dist/compiled/next-server/server.runtime.prod.js:17:1026) {
  clientVersion: '5.18.0',
  errorCode: undefined,
  digest: '4067700805'
}