
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Player
 * 
 */
export type Player = $Result.DefaultSelection<Prisma.$PlayerPayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>
/**
 * Model Sentiment
 * 
 */
export type Sentiment = $Result.DefaultSelection<Prisma.$SentimentPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model DataSource
 * 
 */
export type DataSource = $Result.DefaultSelection<Prisma.$DataSourcePayload>
/**
 * Model Tweet
 * 
 */
export type Tweet = $Result.DefaultSelection<Prisma.$TweetPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Players
 * const players = await prisma.player.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Players
   * const players = await prisma.player.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.PlayerDelegate<ExtArgs>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs>;

  /**
   * `prisma.sentiment`: Exposes CRUD operations for the **Sentiment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sentiments
    * const sentiments = await prisma.sentiment.findMany()
    * ```
    */
  get sentiment(): Prisma.SentimentDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.dataSource`: Exposes CRUD operations for the **DataSource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataSources
    * const dataSources = await prisma.dataSource.findMany()
    * ```
    */
  get dataSource(): Prisma.DataSourceDelegate<ExtArgs>;

  /**
   * `prisma.tweet`: Exposes CRUD operations for the **Tweet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tweets
    * const tweets = await prisma.tweet.findMany()
    * ```
    */
  get tweet(): Prisma.TweetDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Player: 'Player',
    Match: 'Match',
    Sentiment: 'Sentiment',
    User: 'User',
    DataSource: 'DataSource',
    Tweet: 'Tweet'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "player" | "match" | "sentiment" | "user" | "dataSource" | "tweet"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Player: {
        payload: Prisma.$PlayerPayload<ExtArgs>
        fields: Prisma.PlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findFirst: {
            args: Prisma.PlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findMany: {
            args: Prisma.PlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          create: {
            args: Prisma.PlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          createMany: {
            args: Prisma.PlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          delete: {
            args: Prisma.PlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          update: {
            args: Prisma.PlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          deleteMany: {
            args: Prisma.PlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.PlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
      Sentiment: {
        payload: Prisma.$SentimentPayload<ExtArgs>
        fields: Prisma.SentimentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SentimentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SentimentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>
          }
          findFirst: {
            args: Prisma.SentimentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SentimentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>
          }
          findMany: {
            args: Prisma.SentimentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>[]
          }
          create: {
            args: Prisma.SentimentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>
          }
          createMany: {
            args: Prisma.SentimentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SentimentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>[]
          }
          delete: {
            args: Prisma.SentimentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>
          }
          update: {
            args: Prisma.SentimentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>
          }
          deleteMany: {
            args: Prisma.SentimentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SentimentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SentimentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentPayload>
          }
          aggregate: {
            args: Prisma.SentimentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSentiment>
          }
          groupBy: {
            args: Prisma.SentimentGroupByArgs<ExtArgs>
            result: $Utils.Optional<SentimentGroupByOutputType>[]
          }
          count: {
            args: Prisma.SentimentCountArgs<ExtArgs>
            result: $Utils.Optional<SentimentCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      DataSource: {
        payload: Prisma.$DataSourcePayload<ExtArgs>
        fields: Prisma.DataSourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataSourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataSourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          findFirst: {
            args: Prisma.DataSourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataSourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          findMany: {
            args: Prisma.DataSourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>[]
          }
          create: {
            args: Prisma.DataSourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          createMany: {
            args: Prisma.DataSourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DataSourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>[]
          }
          delete: {
            args: Prisma.DataSourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          update: {
            args: Prisma.DataSourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          deleteMany: {
            args: Prisma.DataSourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataSourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DataSourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataSourcePayload>
          }
          aggregate: {
            args: Prisma.DataSourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataSource>
          }
          groupBy: {
            args: Prisma.DataSourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataSourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataSourceCountArgs<ExtArgs>
            result: $Utils.Optional<DataSourceCountAggregateOutputType> | number
          }
        }
      }
      Tweet: {
        payload: Prisma.$TweetPayload<ExtArgs>
        fields: Prisma.TweetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TweetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TweetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>
          }
          findFirst: {
            args: Prisma.TweetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TweetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>
          }
          findMany: {
            args: Prisma.TweetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>[]
          }
          create: {
            args: Prisma.TweetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>
          }
          createMany: {
            args: Prisma.TweetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TweetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>[]
          }
          delete: {
            args: Prisma.TweetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>
          }
          update: {
            args: Prisma.TweetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>
          }
          deleteMany: {
            args: Prisma.TweetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TweetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TweetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TweetPayload>
          }
          aggregate: {
            args: Prisma.TweetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTweet>
          }
          groupBy: {
            args: Prisma.TweetGroupByArgs<ExtArgs>
            result: $Utils.Optional<TweetGroupByOutputType>[]
          }
          count: {
            args: Prisma.TweetCountArgs<ExtArgs>
            result: $Utils.Optional<TweetCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    sentiments: number
  }

  export type PlayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentiments?: boolean | PlayerCountOutputTypeCountSentimentsArgs
  }

  // Custom InputTypes
  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountSentimentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SentimentWhereInput
  }


  /**
   * Count Type MatchCountOutputType
   */

  export type MatchCountOutputType = {
    sentiments: number
    dataSources: number
  }

  export type MatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentiments?: boolean | MatchCountOutputTypeCountSentimentsArgs
    dataSources?: boolean | MatchCountOutputTypeCountDataSourcesArgs
  }

  // Custom InputTypes
  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCountOutputType
     */
    select?: MatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountSentimentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SentimentWhereInput
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountDataSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataSourceWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    dataSources: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataSources?: boolean | UserCountOutputTypeCountDataSourcesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDataSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataSourceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerAvgAggregateOutputType = {
    sentiment: number | null
    tweets: number | null
    aiConfidence: number | null
  }

  export type PlayerSumAggregateOutputType = {
    sentiment: number | null
    tweets: number | null
    aiConfidence: number | null
  }

  export type PlayerMinAggregateOutputType = {
    id: string | null
    name: string | null
    team: string | null
    position: string | null
    sentiment: number | null
    tweets: number | null
    aiConfidence: number | null
    form: string | null
    lastUpdated: Date | null
  }

  export type PlayerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    team: string | null
    position: string | null
    sentiment: number | null
    tweets: number | null
    aiConfidence: number | null
    form: string | null
    lastUpdated: Date | null
  }

  export type PlayerCountAggregateOutputType = {
    id: number
    name: number
    team: number
    position: number
    sentiment: number
    tweets: number
    aiConfidence: number
    form: number
    lastUpdated: number
    _all: number
  }


  export type PlayerAvgAggregateInputType = {
    sentiment?: true
    tweets?: true
    aiConfidence?: true
  }

  export type PlayerSumAggregateInputType = {
    sentiment?: true
    tweets?: true
    aiConfidence?: true
  }

  export type PlayerMinAggregateInputType = {
    id?: true
    name?: true
    team?: true
    position?: true
    sentiment?: true
    tweets?: true
    aiConfidence?: true
    form?: true
    lastUpdated?: true
  }

  export type PlayerMaxAggregateInputType = {
    id?: true
    name?: true
    team?: true
    position?: true
    sentiment?: true
    tweets?: true
    aiConfidence?: true
    form?: true
    lastUpdated?: true
  }

  export type PlayerCountAggregateInputType = {
    id?: true
    name?: true
    team?: true
    position?: true
    sentiment?: true
    tweets?: true
    aiConfidence?: true
    form?: true
    lastUpdated?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type PlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithAggregationInput | PlayerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: PlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _avg?: PlayerAvgAggregateInputType
    _sum?: PlayerSumAggregateInputType
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    id: string
    name: string
    team: string
    position: string
    sentiment: number
    tweets: number
    aiConfidence: number
    form: string
    lastUpdated: Date
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type PlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    team?: boolean
    position?: boolean
    sentiment?: boolean
    tweets?: boolean
    aiConfidence?: boolean
    form?: boolean
    lastUpdated?: boolean
    sentiments?: boolean | Player$sentimentsArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    team?: boolean
    position?: boolean
    sentiment?: boolean
    tweets?: boolean
    aiConfidence?: boolean
    form?: boolean
    lastUpdated?: boolean
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectScalar = {
    id?: boolean
    name?: boolean
    team?: boolean
    position?: boolean
    sentiment?: boolean
    tweets?: boolean
    aiConfidence?: boolean
    form?: boolean
    lastUpdated?: boolean
  }

  export type PlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentiments?: boolean | Player$sentimentsArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Player"
    objects: {
      sentiments: Prisma.$SentimentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      team: string
      position: string
      sentiment: number
      tweets: number
      aiConfidence: number
      form: string
      lastUpdated: Date
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = $Result.GetResult<Prisma.$PlayerPayload, S>

  type PlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface PlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Player'], meta: { name: 'Player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerFindManyArgs>(args?: SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends PlayerCreateArgs>(args: SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerCreateManyArgs>(args?: SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {PlayerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends PlayerDeleteArgs>(args: SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerUpdateArgs>(args: SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs['orderBy'] }
        : { orderBy?: PlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Player model
   */
  readonly fields: PlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sentiments<T extends Player$sentimentsArgs<ExtArgs> = {}>(args?: Subset<T, Player$sentimentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Player model
   */ 
  interface PlayerFieldRefs {
    readonly id: FieldRef<"Player", 'String'>
    readonly name: FieldRef<"Player", 'String'>
    readonly team: FieldRef<"Player", 'String'>
    readonly position: FieldRef<"Player", 'String'>
    readonly sentiment: FieldRef<"Player", 'Int'>
    readonly tweets: FieldRef<"Player", 'Int'>
    readonly aiConfidence: FieldRef<"Player", 'Float'>
    readonly form: FieldRef<"Player", 'String'>
    readonly lastUpdated: FieldRef<"Player", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Player findUnique
   */
  export type PlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findFirst
   */
  export type PlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player create
   */
  export type PlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
  }

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
  }

  /**
   * Player createManyAndReturn
   */
  export type PlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
  }

  /**
   * Player update
   */
  export type PlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
  }

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
  }

  /**
   * Player delete
   */
  export type PlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput
  }

  /**
   * Player.sentiments
   */
  export type Player$sentimentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    where?: SentimentWhereInput
    orderBy?: SentimentOrderByWithRelationInput | SentimentOrderByWithRelationInput[]
    cursor?: SentimentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SentimentScalarFieldEnum | SentimentScalarFieldEnum[]
  }

  /**
   * Player without action
   */
  export type PlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    homeScore: number | null
    awayScore: number | null
    homeSentiment: number | null
    awaySentiment: number | null
  }

  export type MatchSumAggregateOutputType = {
    homeScore: number | null
    awayScore: number | null
    homeSentiment: number | null
    awaySentiment: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: string | null
    homeTeam: string | null
    awayTeam: string | null
    homeScore: number | null
    awayScore: number | null
    status: string | null
    league: string | null
    round: string | null
    date: Date | null
    aggregateScore: string | null
    homeSentiment: number | null
    awaySentiment: number | null
    psycheJSON: string | null
    events: string | null
    lastUpdated: Date | null
  }

  export type MatchMaxAggregateOutputType = {
    id: string | null
    homeTeam: string | null
    awayTeam: string | null
    homeScore: number | null
    awayScore: number | null
    status: string | null
    league: string | null
    round: string | null
    date: Date | null
    aggregateScore: string | null
    homeSentiment: number | null
    awaySentiment: number | null
    psycheJSON: string | null
    events: string | null
    lastUpdated: Date | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    homeTeam: number
    awayTeam: number
    homeScore: number
    awayScore: number
    status: number
    league: number
    round: number
    date: number
    aggregateScore: number
    homeSentiment: number
    awaySentiment: number
    psycheJSON: number
    events: number
    lastUpdated: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    homeScore?: true
    awayScore?: true
    homeSentiment?: true
    awaySentiment?: true
  }

  export type MatchSumAggregateInputType = {
    homeScore?: true
    awayScore?: true
    homeSentiment?: true
    awaySentiment?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    homeTeam?: true
    awayTeam?: true
    homeScore?: true
    awayScore?: true
    status?: true
    league?: true
    round?: true
    date?: true
    aggregateScore?: true
    homeSentiment?: true
    awaySentiment?: true
    psycheJSON?: true
    events?: true
    lastUpdated?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    homeTeam?: true
    awayTeam?: true
    homeScore?: true
    awayScore?: true
    status?: true
    league?: true
    round?: true
    date?: true
    aggregateScore?: true
    homeSentiment?: true
    awaySentiment?: true
    psycheJSON?: true
    events?: true
    lastUpdated?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    homeTeam?: true
    awayTeam?: true
    homeScore?: true
    awayScore?: true
    status?: true
    league?: true
    round?: true
    date?: true
    aggregateScore?: true
    homeSentiment?: true
    awaySentiment?: true
    psycheJSON?: true
    events?: true
    lastUpdated?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round: string | null
    date: Date
    aggregateScore: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON: string | null
    events: string | null
    lastUpdated: Date
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    homeTeam?: boolean
    awayTeam?: boolean
    homeScore?: boolean
    awayScore?: boolean
    status?: boolean
    league?: boolean
    round?: boolean
    date?: boolean
    aggregateScore?: boolean
    homeSentiment?: boolean
    awaySentiment?: boolean
    psycheJSON?: boolean
    events?: boolean
    lastUpdated?: boolean
    sentiments?: boolean | Match$sentimentsArgs<ExtArgs>
    dataSources?: boolean | Match$dataSourcesArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    homeTeam?: boolean
    awayTeam?: boolean
    homeScore?: boolean
    awayScore?: boolean
    status?: boolean
    league?: boolean
    round?: boolean
    date?: boolean
    aggregateScore?: boolean
    homeSentiment?: boolean
    awaySentiment?: boolean
    psycheJSON?: boolean
    events?: boolean
    lastUpdated?: boolean
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    homeTeam?: boolean
    awayTeam?: boolean
    homeScore?: boolean
    awayScore?: boolean
    status?: boolean
    league?: boolean
    round?: boolean
    date?: boolean
    aggregateScore?: boolean
    homeSentiment?: boolean
    awaySentiment?: boolean
    psycheJSON?: boolean
    events?: boolean
    lastUpdated?: boolean
  }

  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentiments?: boolean | Match$sentimentsArgs<ExtArgs>
    dataSources?: boolean | Match$dataSourcesArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      sentiments: Prisma.$SentimentPayload<ExtArgs>[]
      dataSources: Prisma.$DataSourcePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      homeTeam: string
      awayTeam: string
      homeScore: number
      awayScore: number
      status: string
      league: string
      round: string | null
      date: Date
      aggregateScore: string | null
      homeSentiment: number
      awaySentiment: number
      psycheJSON: string | null
      events: string | null
      lastUpdated: Date
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sentiments<T extends Match$sentimentsArgs<ExtArgs> = {}>(args?: Subset<T, Match$sentimentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "findMany"> | Null>
    dataSources<T extends Match$dataSourcesArgs<ExtArgs> = {}>(args?: Subset<T, Match$dataSourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */ 
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'String'>
    readonly homeTeam: FieldRef<"Match", 'String'>
    readonly awayTeam: FieldRef<"Match", 'String'>
    readonly homeScore: FieldRef<"Match", 'Int'>
    readonly awayScore: FieldRef<"Match", 'Int'>
    readonly status: FieldRef<"Match", 'String'>
    readonly league: FieldRef<"Match", 'String'>
    readonly round: FieldRef<"Match", 'String'>
    readonly date: FieldRef<"Match", 'DateTime'>
    readonly aggregateScore: FieldRef<"Match", 'String'>
    readonly homeSentiment: FieldRef<"Match", 'Int'>
    readonly awaySentiment: FieldRef<"Match", 'Int'>
    readonly psycheJSON: FieldRef<"Match", 'String'>
    readonly events: FieldRef<"Match", 'String'>
    readonly lastUpdated: FieldRef<"Match", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
  }

  /**
   * Match.sentiments
   */
  export type Match$sentimentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    where?: SentimentWhereInput
    orderBy?: SentimentOrderByWithRelationInput | SentimentOrderByWithRelationInput[]
    cursor?: SentimentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SentimentScalarFieldEnum | SentimentScalarFieldEnum[]
  }

  /**
   * Match.dataSources
   */
  export type Match$dataSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    where?: DataSourceWhereInput
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    cursor?: DataSourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Model Sentiment
   */

  export type AggregateSentiment = {
    _count: SentimentCountAggregateOutputType | null
    _avg: SentimentAvgAggregateOutputType | null
    _sum: SentimentSumAggregateOutputType | null
    _min: SentimentMinAggregateOutputType | null
    _max: SentimentMaxAggregateOutputType | null
  }

  export type SentimentAvgAggregateOutputType = {
    score: number | null
  }

  export type SentimentSumAggregateOutputType = {
    score: number | null
  }

  export type SentimentMinAggregateOutputType = {
    id: string | null
    playerId: string | null
    matchId: string | null
    score: number | null
    source: string | null
    themes: string | null
    breakdown: string | null
    timestamp: Date | null
  }

  export type SentimentMaxAggregateOutputType = {
    id: string | null
    playerId: string | null
    matchId: string | null
    score: number | null
    source: string | null
    themes: string | null
    breakdown: string | null
    timestamp: Date | null
  }

  export type SentimentCountAggregateOutputType = {
    id: number
    playerId: number
    matchId: number
    score: number
    source: number
    themes: number
    breakdown: number
    timestamp: number
    _all: number
  }


  export type SentimentAvgAggregateInputType = {
    score?: true
  }

  export type SentimentSumAggregateInputType = {
    score?: true
  }

  export type SentimentMinAggregateInputType = {
    id?: true
    playerId?: true
    matchId?: true
    score?: true
    source?: true
    themes?: true
    breakdown?: true
    timestamp?: true
  }

  export type SentimentMaxAggregateInputType = {
    id?: true
    playerId?: true
    matchId?: true
    score?: true
    source?: true
    themes?: true
    breakdown?: true
    timestamp?: true
  }

  export type SentimentCountAggregateInputType = {
    id?: true
    playerId?: true
    matchId?: true
    score?: true
    source?: true
    themes?: true
    breakdown?: true
    timestamp?: true
    _all?: true
  }

  export type SentimentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sentiment to aggregate.
     */
    where?: SentimentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sentiments to fetch.
     */
    orderBy?: SentimentOrderByWithRelationInput | SentimentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SentimentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sentiments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sentiments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sentiments
    **/
    _count?: true | SentimentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SentimentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SentimentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SentimentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SentimentMaxAggregateInputType
  }

  export type GetSentimentAggregateType<T extends SentimentAggregateArgs> = {
        [P in keyof T & keyof AggregateSentiment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSentiment[P]>
      : GetScalarType<T[P], AggregateSentiment[P]>
  }




  export type SentimentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SentimentWhereInput
    orderBy?: SentimentOrderByWithAggregationInput | SentimentOrderByWithAggregationInput[]
    by: SentimentScalarFieldEnum[] | SentimentScalarFieldEnum
    having?: SentimentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SentimentCountAggregateInputType | true
    _avg?: SentimentAvgAggregateInputType
    _sum?: SentimentSumAggregateInputType
    _min?: SentimentMinAggregateInputType
    _max?: SentimentMaxAggregateInputType
  }

  export type SentimentGroupByOutputType = {
    id: string
    playerId: string | null
    matchId: string | null
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp: Date
    _count: SentimentCountAggregateOutputType | null
    _avg: SentimentAvgAggregateOutputType | null
    _sum: SentimentSumAggregateOutputType | null
    _min: SentimentMinAggregateOutputType | null
    _max: SentimentMaxAggregateOutputType | null
  }

  type GetSentimentGroupByPayload<T extends SentimentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SentimentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SentimentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SentimentGroupByOutputType[P]>
            : GetScalarType<T[P], SentimentGroupByOutputType[P]>
        }
      >
    >


  export type SentimentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    matchId?: boolean
    score?: boolean
    source?: boolean
    themes?: boolean
    breakdown?: boolean
    timestamp?: boolean
    match?: boolean | Sentiment$matchArgs<ExtArgs>
    player?: boolean | Sentiment$playerArgs<ExtArgs>
  }, ExtArgs["result"]["sentiment"]>

  export type SentimentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    matchId?: boolean
    score?: boolean
    source?: boolean
    themes?: boolean
    breakdown?: boolean
    timestamp?: boolean
    match?: boolean | Sentiment$matchArgs<ExtArgs>
    player?: boolean | Sentiment$playerArgs<ExtArgs>
  }, ExtArgs["result"]["sentiment"]>

  export type SentimentSelectScalar = {
    id?: boolean
    playerId?: boolean
    matchId?: boolean
    score?: boolean
    source?: boolean
    themes?: boolean
    breakdown?: boolean
    timestamp?: boolean
  }

  export type SentimentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | Sentiment$matchArgs<ExtArgs>
    player?: boolean | Sentiment$playerArgs<ExtArgs>
  }
  export type SentimentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | Sentiment$matchArgs<ExtArgs>
    player?: boolean | Sentiment$playerArgs<ExtArgs>
  }

  export type $SentimentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sentiment"
    objects: {
      match: Prisma.$MatchPayload<ExtArgs> | null
      player: Prisma.$PlayerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      playerId: string | null
      matchId: string | null
      score: number
      source: string
      themes: string
      breakdown: string
      timestamp: Date
    }, ExtArgs["result"]["sentiment"]>
    composites: {}
  }

  type SentimentGetPayload<S extends boolean | null | undefined | SentimentDefaultArgs> = $Result.GetResult<Prisma.$SentimentPayload, S>

  type SentimentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SentimentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SentimentCountAggregateInputType | true
    }

  export interface SentimentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sentiment'], meta: { name: 'Sentiment' } }
    /**
     * Find zero or one Sentiment that matches the filter.
     * @param {SentimentFindUniqueArgs} args - Arguments to find a Sentiment
     * @example
     * // Get one Sentiment
     * const sentiment = await prisma.sentiment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SentimentFindUniqueArgs>(args: SelectSubset<T, SentimentFindUniqueArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Sentiment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SentimentFindUniqueOrThrowArgs} args - Arguments to find a Sentiment
     * @example
     * // Get one Sentiment
     * const sentiment = await prisma.sentiment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SentimentFindUniqueOrThrowArgs>(args: SelectSubset<T, SentimentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Sentiment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentFindFirstArgs} args - Arguments to find a Sentiment
     * @example
     * // Get one Sentiment
     * const sentiment = await prisma.sentiment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SentimentFindFirstArgs>(args?: SelectSubset<T, SentimentFindFirstArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Sentiment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentFindFirstOrThrowArgs} args - Arguments to find a Sentiment
     * @example
     * // Get one Sentiment
     * const sentiment = await prisma.sentiment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SentimentFindFirstOrThrowArgs>(args?: SelectSubset<T, SentimentFindFirstOrThrowArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sentiments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sentiments
     * const sentiments = await prisma.sentiment.findMany()
     * 
     * // Get first 10 Sentiments
     * const sentiments = await prisma.sentiment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sentimentWithIdOnly = await prisma.sentiment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SentimentFindManyArgs>(args?: SelectSubset<T, SentimentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Sentiment.
     * @param {SentimentCreateArgs} args - Arguments to create a Sentiment.
     * @example
     * // Create one Sentiment
     * const Sentiment = await prisma.sentiment.create({
     *   data: {
     *     // ... data to create a Sentiment
     *   }
     * })
     * 
     */
    create<T extends SentimentCreateArgs>(args: SelectSubset<T, SentimentCreateArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sentiments.
     * @param {SentimentCreateManyArgs} args - Arguments to create many Sentiments.
     * @example
     * // Create many Sentiments
     * const sentiment = await prisma.sentiment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SentimentCreateManyArgs>(args?: SelectSubset<T, SentimentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sentiments and returns the data saved in the database.
     * @param {SentimentCreateManyAndReturnArgs} args - Arguments to create many Sentiments.
     * @example
     * // Create many Sentiments
     * const sentiment = await prisma.sentiment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sentiments and only return the `id`
     * const sentimentWithIdOnly = await prisma.sentiment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SentimentCreateManyAndReturnArgs>(args?: SelectSubset<T, SentimentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Sentiment.
     * @param {SentimentDeleteArgs} args - Arguments to delete one Sentiment.
     * @example
     * // Delete one Sentiment
     * const Sentiment = await prisma.sentiment.delete({
     *   where: {
     *     // ... filter to delete one Sentiment
     *   }
     * })
     * 
     */
    delete<T extends SentimentDeleteArgs>(args: SelectSubset<T, SentimentDeleteArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Sentiment.
     * @param {SentimentUpdateArgs} args - Arguments to update one Sentiment.
     * @example
     * // Update one Sentiment
     * const sentiment = await prisma.sentiment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SentimentUpdateArgs>(args: SelectSubset<T, SentimentUpdateArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sentiments.
     * @param {SentimentDeleteManyArgs} args - Arguments to filter Sentiments to delete.
     * @example
     * // Delete a few Sentiments
     * const { count } = await prisma.sentiment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SentimentDeleteManyArgs>(args?: SelectSubset<T, SentimentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sentiments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sentiments
     * const sentiment = await prisma.sentiment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SentimentUpdateManyArgs>(args: SelectSubset<T, SentimentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Sentiment.
     * @param {SentimentUpsertArgs} args - Arguments to update or create a Sentiment.
     * @example
     * // Update or create a Sentiment
     * const sentiment = await prisma.sentiment.upsert({
     *   create: {
     *     // ... data to create a Sentiment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sentiment we want to update
     *   }
     * })
     */
    upsert<T extends SentimentUpsertArgs>(args: SelectSubset<T, SentimentUpsertArgs<ExtArgs>>): Prisma__SentimentClient<$Result.GetResult<Prisma.$SentimentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sentiments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentCountArgs} args - Arguments to filter Sentiments to count.
     * @example
     * // Count the number of Sentiments
     * const count = await prisma.sentiment.count({
     *   where: {
     *     // ... the filter for the Sentiments we want to count
     *   }
     * })
    **/
    count<T extends SentimentCountArgs>(
      args?: Subset<T, SentimentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SentimentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sentiment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SentimentAggregateArgs>(args: Subset<T, SentimentAggregateArgs>): Prisma.PrismaPromise<GetSentimentAggregateType<T>>

    /**
     * Group by Sentiment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SentimentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SentimentGroupByArgs['orderBy'] }
        : { orderBy?: SentimentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SentimentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSentimentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sentiment model
   */
  readonly fields: SentimentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sentiment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SentimentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends Sentiment$matchArgs<ExtArgs> = {}>(args?: Subset<T, Sentiment$matchArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    player<T extends Sentiment$playerArgs<ExtArgs> = {}>(args?: Subset<T, Sentiment$playerArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sentiment model
   */ 
  interface SentimentFieldRefs {
    readonly id: FieldRef<"Sentiment", 'String'>
    readonly playerId: FieldRef<"Sentiment", 'String'>
    readonly matchId: FieldRef<"Sentiment", 'String'>
    readonly score: FieldRef<"Sentiment", 'Int'>
    readonly source: FieldRef<"Sentiment", 'String'>
    readonly themes: FieldRef<"Sentiment", 'String'>
    readonly breakdown: FieldRef<"Sentiment", 'String'>
    readonly timestamp: FieldRef<"Sentiment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Sentiment findUnique
   */
  export type SentimentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * Filter, which Sentiment to fetch.
     */
    where: SentimentWhereUniqueInput
  }

  /**
   * Sentiment findUniqueOrThrow
   */
  export type SentimentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * Filter, which Sentiment to fetch.
     */
    where: SentimentWhereUniqueInput
  }

  /**
   * Sentiment findFirst
   */
  export type SentimentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * Filter, which Sentiment to fetch.
     */
    where?: SentimentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sentiments to fetch.
     */
    orderBy?: SentimentOrderByWithRelationInput | SentimentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sentiments.
     */
    cursor?: SentimentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sentiments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sentiments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sentiments.
     */
    distinct?: SentimentScalarFieldEnum | SentimentScalarFieldEnum[]
  }

  /**
   * Sentiment findFirstOrThrow
   */
  export type SentimentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * Filter, which Sentiment to fetch.
     */
    where?: SentimentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sentiments to fetch.
     */
    orderBy?: SentimentOrderByWithRelationInput | SentimentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sentiments.
     */
    cursor?: SentimentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sentiments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sentiments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sentiments.
     */
    distinct?: SentimentScalarFieldEnum | SentimentScalarFieldEnum[]
  }

  /**
   * Sentiment findMany
   */
  export type SentimentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * Filter, which Sentiments to fetch.
     */
    where?: SentimentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sentiments to fetch.
     */
    orderBy?: SentimentOrderByWithRelationInput | SentimentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sentiments.
     */
    cursor?: SentimentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sentiments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sentiments.
     */
    skip?: number
    distinct?: SentimentScalarFieldEnum | SentimentScalarFieldEnum[]
  }

  /**
   * Sentiment create
   */
  export type SentimentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * The data needed to create a Sentiment.
     */
    data: XOR<SentimentCreateInput, SentimentUncheckedCreateInput>
  }

  /**
   * Sentiment createMany
   */
  export type SentimentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sentiments.
     */
    data: SentimentCreateManyInput | SentimentCreateManyInput[]
  }

  /**
   * Sentiment createManyAndReturn
   */
  export type SentimentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sentiments.
     */
    data: SentimentCreateManyInput | SentimentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sentiment update
   */
  export type SentimentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * The data needed to update a Sentiment.
     */
    data: XOR<SentimentUpdateInput, SentimentUncheckedUpdateInput>
    /**
     * Choose, which Sentiment to update.
     */
    where: SentimentWhereUniqueInput
  }

  /**
   * Sentiment updateMany
   */
  export type SentimentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sentiments.
     */
    data: XOR<SentimentUpdateManyMutationInput, SentimentUncheckedUpdateManyInput>
    /**
     * Filter which Sentiments to update
     */
    where?: SentimentWhereInput
  }

  /**
   * Sentiment upsert
   */
  export type SentimentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * The filter to search for the Sentiment to update in case it exists.
     */
    where: SentimentWhereUniqueInput
    /**
     * In case the Sentiment found by the `where` argument doesn't exist, create a new Sentiment with this data.
     */
    create: XOR<SentimentCreateInput, SentimentUncheckedCreateInput>
    /**
     * In case the Sentiment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SentimentUpdateInput, SentimentUncheckedUpdateInput>
  }

  /**
   * Sentiment delete
   */
  export type SentimentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
    /**
     * Filter which Sentiment to delete.
     */
    where: SentimentWhereUniqueInput
  }

  /**
   * Sentiment deleteMany
   */
  export type SentimentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sentiments to delete
     */
    where?: SentimentWhereInput
  }

  /**
   * Sentiment.match
   */
  export type Sentiment$matchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
  }

  /**
   * Sentiment.player
   */
  export type Sentiment$playerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
  }

  /**
   * Sentiment without action
   */
  export type SentimentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sentiment
     */
    select?: SentimentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SentimentInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    role: string | null
    assignedTeam: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    role: string | null
    assignedTeam: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    role: number
    assignedTeam: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    assignedTeam?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    assignedTeam?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    assignedTeam?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    password: string
    role: string
    assignedTeam: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    assignedTeam?: boolean
    createdAt?: boolean
    dataSources?: boolean | User$dataSourcesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    assignedTeam?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    assignedTeam?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dataSources?: boolean | User$dataSourcesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      dataSources: Prisma.$DataSourcePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password: string
      role: string
      assignedTeam: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dataSources<T extends User$dataSourcesArgs<ExtArgs> = {}>(args?: Subset<T, User$dataSourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly assignedTeam: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.dataSources
   */
  export type User$dataSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    where?: DataSourceWhereInput
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    cursor?: DataSourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model DataSource
   */

  export type AggregateDataSource = {
    _count: DataSourceCountAggregateOutputType | null
    _min: DataSourceMinAggregateOutputType | null
    _max: DataSourceMaxAggregateOutputType | null
  }

  export type DataSourceMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    url: string | null
    isActive: boolean | null
    lastScraped: Date | null
    userId: string | null
    matchId: string | null
    clubId: string | null
  }

  export type DataSourceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    url: string | null
    isActive: boolean | null
    lastScraped: Date | null
    userId: string | null
    matchId: string | null
    clubId: string | null
  }

  export type DataSourceCountAggregateOutputType = {
    id: number
    name: number
    type: number
    url: number
    isActive: number
    lastScraped: number
    userId: number
    matchId: number
    clubId: number
    _all: number
  }


  export type DataSourceMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    url?: true
    isActive?: true
    lastScraped?: true
    userId?: true
    matchId?: true
    clubId?: true
  }

  export type DataSourceMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    url?: true
    isActive?: true
    lastScraped?: true
    userId?: true
    matchId?: true
    clubId?: true
  }

  export type DataSourceCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    url?: true
    isActive?: true
    lastScraped?: true
    userId?: true
    matchId?: true
    clubId?: true
    _all?: true
  }

  export type DataSourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataSource to aggregate.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataSources
    **/
    _count?: true | DataSourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataSourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataSourceMaxAggregateInputType
  }

  export type GetDataSourceAggregateType<T extends DataSourceAggregateArgs> = {
        [P in keyof T & keyof AggregateDataSource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataSource[P]>
      : GetScalarType<T[P], AggregateDataSource[P]>
  }




  export type DataSourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataSourceWhereInput
    orderBy?: DataSourceOrderByWithAggregationInput | DataSourceOrderByWithAggregationInput[]
    by: DataSourceScalarFieldEnum[] | DataSourceScalarFieldEnum
    having?: DataSourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataSourceCountAggregateInputType | true
    _min?: DataSourceMinAggregateInputType
    _max?: DataSourceMaxAggregateInputType
  }

  export type DataSourceGroupByOutputType = {
    id: string
    name: string
    type: string
    url: string
    isActive: boolean
    lastScraped: Date
    userId: string | null
    matchId: string | null
    clubId: string | null
    _count: DataSourceCountAggregateOutputType | null
    _min: DataSourceMinAggregateOutputType | null
    _max: DataSourceMaxAggregateOutputType | null
  }

  type GetDataSourceGroupByPayload<T extends DataSourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataSourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataSourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataSourceGroupByOutputType[P]>
            : GetScalarType<T[P], DataSourceGroupByOutputType[P]>
        }
      >
    >


  export type DataSourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    url?: boolean
    isActive?: boolean
    lastScraped?: boolean
    userId?: boolean
    matchId?: boolean
    clubId?: boolean
    user?: boolean | DataSource$userArgs<ExtArgs>
    match?: boolean | DataSource$matchArgs<ExtArgs>
  }, ExtArgs["result"]["dataSource"]>

  export type DataSourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    url?: boolean
    isActive?: boolean
    lastScraped?: boolean
    userId?: boolean
    matchId?: boolean
    clubId?: boolean
    user?: boolean | DataSource$userArgs<ExtArgs>
    match?: boolean | DataSource$matchArgs<ExtArgs>
  }, ExtArgs["result"]["dataSource"]>

  export type DataSourceSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    url?: boolean
    isActive?: boolean
    lastScraped?: boolean
    userId?: boolean
    matchId?: boolean
    clubId?: boolean
  }

  export type DataSourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DataSource$userArgs<ExtArgs>
    match?: boolean | DataSource$matchArgs<ExtArgs>
  }
  export type DataSourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | DataSource$userArgs<ExtArgs>
    match?: boolean | DataSource$matchArgs<ExtArgs>
  }

  export type $DataSourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataSource"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      match: Prisma.$MatchPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      url: string
      isActive: boolean
      lastScraped: Date
      userId: string | null
      matchId: string | null
      clubId: string | null
    }, ExtArgs["result"]["dataSource"]>
    composites: {}
  }

  type DataSourceGetPayload<S extends boolean | null | undefined | DataSourceDefaultArgs> = $Result.GetResult<Prisma.$DataSourcePayload, S>

  type DataSourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DataSourceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DataSourceCountAggregateInputType | true
    }

  export interface DataSourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataSource'], meta: { name: 'DataSource' } }
    /**
     * Find zero or one DataSource that matches the filter.
     * @param {DataSourceFindUniqueArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataSourceFindUniqueArgs>(args: SelectSubset<T, DataSourceFindUniqueArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DataSource that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DataSourceFindUniqueOrThrowArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataSourceFindUniqueOrThrowArgs>(args: SelectSubset<T, DataSourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DataSource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceFindFirstArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataSourceFindFirstArgs>(args?: SelectSubset<T, DataSourceFindFirstArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DataSource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceFindFirstOrThrowArgs} args - Arguments to find a DataSource
     * @example
     * // Get one DataSource
     * const dataSource = await prisma.dataSource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataSourceFindFirstOrThrowArgs>(args?: SelectSubset<T, DataSourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DataSources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataSources
     * const dataSources = await prisma.dataSource.findMany()
     * 
     * // Get first 10 DataSources
     * const dataSources = await prisma.dataSource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataSourceWithIdOnly = await prisma.dataSource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataSourceFindManyArgs>(args?: SelectSubset<T, DataSourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DataSource.
     * @param {DataSourceCreateArgs} args - Arguments to create a DataSource.
     * @example
     * // Create one DataSource
     * const DataSource = await prisma.dataSource.create({
     *   data: {
     *     // ... data to create a DataSource
     *   }
     * })
     * 
     */
    create<T extends DataSourceCreateArgs>(args: SelectSubset<T, DataSourceCreateArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DataSources.
     * @param {DataSourceCreateManyArgs} args - Arguments to create many DataSources.
     * @example
     * // Create many DataSources
     * const dataSource = await prisma.dataSource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataSourceCreateManyArgs>(args?: SelectSubset<T, DataSourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DataSources and returns the data saved in the database.
     * @param {DataSourceCreateManyAndReturnArgs} args - Arguments to create many DataSources.
     * @example
     * // Create many DataSources
     * const dataSource = await prisma.dataSource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DataSources and only return the `id`
     * const dataSourceWithIdOnly = await prisma.dataSource.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DataSourceCreateManyAndReturnArgs>(args?: SelectSubset<T, DataSourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DataSource.
     * @param {DataSourceDeleteArgs} args - Arguments to delete one DataSource.
     * @example
     * // Delete one DataSource
     * const DataSource = await prisma.dataSource.delete({
     *   where: {
     *     // ... filter to delete one DataSource
     *   }
     * })
     * 
     */
    delete<T extends DataSourceDeleteArgs>(args: SelectSubset<T, DataSourceDeleteArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DataSource.
     * @param {DataSourceUpdateArgs} args - Arguments to update one DataSource.
     * @example
     * // Update one DataSource
     * const dataSource = await prisma.dataSource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataSourceUpdateArgs>(args: SelectSubset<T, DataSourceUpdateArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DataSources.
     * @param {DataSourceDeleteManyArgs} args - Arguments to filter DataSources to delete.
     * @example
     * // Delete a few DataSources
     * const { count } = await prisma.dataSource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataSourceDeleteManyArgs>(args?: SelectSubset<T, DataSourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataSources
     * const dataSource = await prisma.dataSource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataSourceUpdateManyArgs>(args: SelectSubset<T, DataSourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DataSource.
     * @param {DataSourceUpsertArgs} args - Arguments to update or create a DataSource.
     * @example
     * // Update or create a DataSource
     * const dataSource = await prisma.dataSource.upsert({
     *   create: {
     *     // ... data to create a DataSource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataSource we want to update
     *   }
     * })
     */
    upsert<T extends DataSourceUpsertArgs>(args: SelectSubset<T, DataSourceUpsertArgs<ExtArgs>>): Prisma__DataSourceClient<$Result.GetResult<Prisma.$DataSourcePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DataSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceCountArgs} args - Arguments to filter DataSources to count.
     * @example
     * // Count the number of DataSources
     * const count = await prisma.dataSource.count({
     *   where: {
     *     // ... the filter for the DataSources we want to count
     *   }
     * })
    **/
    count<T extends DataSourceCountArgs>(
      args?: Subset<T, DataSourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataSourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataSourceAggregateArgs>(args: Subset<T, DataSourceAggregateArgs>): Prisma.PrismaPromise<GetDataSourceAggregateType<T>>

    /**
     * Group by DataSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataSourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DataSourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataSourceGroupByArgs['orderBy'] }
        : { orderBy?: DataSourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DataSourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataSourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataSource model
   */
  readonly fields: DataSourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataSource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataSourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends DataSource$userArgs<ExtArgs> = {}>(args?: Subset<T, DataSource$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    match<T extends DataSource$matchArgs<ExtArgs> = {}>(args?: Subset<T, DataSource$matchArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DataSource model
   */ 
  interface DataSourceFieldRefs {
    readonly id: FieldRef<"DataSource", 'String'>
    readonly name: FieldRef<"DataSource", 'String'>
    readonly type: FieldRef<"DataSource", 'String'>
    readonly url: FieldRef<"DataSource", 'String'>
    readonly isActive: FieldRef<"DataSource", 'Boolean'>
    readonly lastScraped: FieldRef<"DataSource", 'DateTime'>
    readonly userId: FieldRef<"DataSource", 'String'>
    readonly matchId: FieldRef<"DataSource", 'String'>
    readonly clubId: FieldRef<"DataSource", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DataSource findUnique
   */
  export type DataSourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource findUniqueOrThrow
   */
  export type DataSourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource findFirst
   */
  export type DataSourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataSources.
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataSources.
     */
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * DataSource findFirstOrThrow
   */
  export type DataSourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSource to fetch.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataSources.
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataSources.
     */
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * DataSource findMany
   */
  export type DataSourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter, which DataSources to fetch.
     */
    where?: DataSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataSources to fetch.
     */
    orderBy?: DataSourceOrderByWithRelationInput | DataSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataSources.
     */
    cursor?: DataSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataSources.
     */
    skip?: number
    distinct?: DataSourceScalarFieldEnum | DataSourceScalarFieldEnum[]
  }

  /**
   * DataSource create
   */
  export type DataSourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * The data needed to create a DataSource.
     */
    data: XOR<DataSourceCreateInput, DataSourceUncheckedCreateInput>
  }

  /**
   * DataSource createMany
   */
  export type DataSourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataSources.
     */
    data: DataSourceCreateManyInput | DataSourceCreateManyInput[]
  }

  /**
   * DataSource createManyAndReturn
   */
  export type DataSourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DataSources.
     */
    data: DataSourceCreateManyInput | DataSourceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DataSource update
   */
  export type DataSourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * The data needed to update a DataSource.
     */
    data: XOR<DataSourceUpdateInput, DataSourceUncheckedUpdateInput>
    /**
     * Choose, which DataSource to update.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource updateMany
   */
  export type DataSourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataSources.
     */
    data: XOR<DataSourceUpdateManyMutationInput, DataSourceUncheckedUpdateManyInput>
    /**
     * Filter which DataSources to update
     */
    where?: DataSourceWhereInput
  }

  /**
   * DataSource upsert
   */
  export type DataSourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * The filter to search for the DataSource to update in case it exists.
     */
    where: DataSourceWhereUniqueInput
    /**
     * In case the DataSource found by the `where` argument doesn't exist, create a new DataSource with this data.
     */
    create: XOR<DataSourceCreateInput, DataSourceUncheckedCreateInput>
    /**
     * In case the DataSource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataSourceUpdateInput, DataSourceUncheckedUpdateInput>
  }

  /**
   * DataSource delete
   */
  export type DataSourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
    /**
     * Filter which DataSource to delete.
     */
    where: DataSourceWhereUniqueInput
  }

  /**
   * DataSource deleteMany
   */
  export type DataSourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataSources to delete
     */
    where?: DataSourceWhereInput
  }

  /**
   * DataSource.user
   */
  export type DataSource$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * DataSource.match
   */
  export type DataSource$matchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
  }

  /**
   * DataSource without action
   */
  export type DataSourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataSource
     */
    select?: DataSourceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataSourceInclude<ExtArgs> | null
  }


  /**
   * Model Tweet
   */

  export type AggregateTweet = {
    _count: TweetCountAggregateOutputType | null
    _avg: TweetAvgAggregateOutputType | null
    _sum: TweetSumAggregateOutputType | null
    _min: TweetMinAggregateOutputType | null
    _max: TweetMaxAggregateOutputType | null
  }

  export type TweetAvgAggregateOutputType = {
    sentiment: number | null
    likes: number | null
    replies: number | null
    retweets: number | null
  }

  export type TweetSumAggregateOutputType = {
    sentiment: number | null
    likes: number | null
    replies: number | null
    retweets: number | null
  }

  export type TweetMinAggregateOutputType = {
    id: string | null
    author: string | null
    handle: string | null
    content: string | null
    sentiment: number | null
    likes: number | null
    replies: number | null
    retweets: number | null
    url: string | null
    avatarBg: string | null
    avatarInitial: string | null
    createdAt: Date | null
  }

  export type TweetMaxAggregateOutputType = {
    id: string | null
    author: string | null
    handle: string | null
    content: string | null
    sentiment: number | null
    likes: number | null
    replies: number | null
    retweets: number | null
    url: string | null
    avatarBg: string | null
    avatarInitial: string | null
    createdAt: Date | null
  }

  export type TweetCountAggregateOutputType = {
    id: number
    author: number
    handle: number
    content: number
    sentiment: number
    likes: number
    replies: number
    retweets: number
    url: number
    avatarBg: number
    avatarInitial: number
    createdAt: number
    _all: number
  }


  export type TweetAvgAggregateInputType = {
    sentiment?: true
    likes?: true
    replies?: true
    retweets?: true
  }

  export type TweetSumAggregateInputType = {
    sentiment?: true
    likes?: true
    replies?: true
    retweets?: true
  }

  export type TweetMinAggregateInputType = {
    id?: true
    author?: true
    handle?: true
    content?: true
    sentiment?: true
    likes?: true
    replies?: true
    retweets?: true
    url?: true
    avatarBg?: true
    avatarInitial?: true
    createdAt?: true
  }

  export type TweetMaxAggregateInputType = {
    id?: true
    author?: true
    handle?: true
    content?: true
    sentiment?: true
    likes?: true
    replies?: true
    retweets?: true
    url?: true
    avatarBg?: true
    avatarInitial?: true
    createdAt?: true
  }

  export type TweetCountAggregateInputType = {
    id?: true
    author?: true
    handle?: true
    content?: true
    sentiment?: true
    likes?: true
    replies?: true
    retweets?: true
    url?: true
    avatarBg?: true
    avatarInitial?: true
    createdAt?: true
    _all?: true
  }

  export type TweetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tweet to aggregate.
     */
    where?: TweetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tweets to fetch.
     */
    orderBy?: TweetOrderByWithRelationInput | TweetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TweetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tweets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tweets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tweets
    **/
    _count?: true | TweetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TweetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TweetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TweetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TweetMaxAggregateInputType
  }

  export type GetTweetAggregateType<T extends TweetAggregateArgs> = {
        [P in keyof T & keyof AggregateTweet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTweet[P]>
      : GetScalarType<T[P], AggregateTweet[P]>
  }




  export type TweetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TweetWhereInput
    orderBy?: TweetOrderByWithAggregationInput | TweetOrderByWithAggregationInput[]
    by: TweetScalarFieldEnum[] | TweetScalarFieldEnum
    having?: TweetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TweetCountAggregateInputType | true
    _avg?: TweetAvgAggregateInputType
    _sum?: TweetSumAggregateInputType
    _min?: TweetMinAggregateInputType
    _max?: TweetMaxAggregateInputType
  }

  export type TweetGroupByOutputType = {
    id: string
    author: string
    handle: string
    content: string
    sentiment: number
    likes: number
    replies: number
    retweets: number
    url: string
    avatarBg: string
    avatarInitial: string
    createdAt: Date
    _count: TweetCountAggregateOutputType | null
    _avg: TweetAvgAggregateOutputType | null
    _sum: TweetSumAggregateOutputType | null
    _min: TweetMinAggregateOutputType | null
    _max: TweetMaxAggregateOutputType | null
  }

  type GetTweetGroupByPayload<T extends TweetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TweetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TweetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TweetGroupByOutputType[P]>
            : GetScalarType<T[P], TweetGroupByOutputType[P]>
        }
      >
    >


  export type TweetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    author?: boolean
    handle?: boolean
    content?: boolean
    sentiment?: boolean
    likes?: boolean
    replies?: boolean
    retweets?: boolean
    url?: boolean
    avatarBg?: boolean
    avatarInitial?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tweet"]>

  export type TweetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    author?: boolean
    handle?: boolean
    content?: boolean
    sentiment?: boolean
    likes?: boolean
    replies?: boolean
    retweets?: boolean
    url?: boolean
    avatarBg?: boolean
    avatarInitial?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tweet"]>

  export type TweetSelectScalar = {
    id?: boolean
    author?: boolean
    handle?: boolean
    content?: boolean
    sentiment?: boolean
    likes?: boolean
    replies?: boolean
    retweets?: boolean
    url?: boolean
    avatarBg?: boolean
    avatarInitial?: boolean
    createdAt?: boolean
  }


  export type $TweetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tweet"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      author: string
      handle: string
      content: string
      sentiment: number
      likes: number
      replies: number
      retweets: number
      url: string
      avatarBg: string
      avatarInitial: string
      createdAt: Date
    }, ExtArgs["result"]["tweet"]>
    composites: {}
  }

  type TweetGetPayload<S extends boolean | null | undefined | TweetDefaultArgs> = $Result.GetResult<Prisma.$TweetPayload, S>

  type TweetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TweetFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TweetCountAggregateInputType | true
    }

  export interface TweetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tweet'], meta: { name: 'Tweet' } }
    /**
     * Find zero or one Tweet that matches the filter.
     * @param {TweetFindUniqueArgs} args - Arguments to find a Tweet
     * @example
     * // Get one Tweet
     * const tweet = await prisma.tweet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TweetFindUniqueArgs>(args: SelectSubset<T, TweetFindUniqueArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Tweet that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TweetFindUniqueOrThrowArgs} args - Arguments to find a Tweet
     * @example
     * // Get one Tweet
     * const tweet = await prisma.tweet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TweetFindUniqueOrThrowArgs>(args: SelectSubset<T, TweetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Tweet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetFindFirstArgs} args - Arguments to find a Tweet
     * @example
     * // Get one Tweet
     * const tweet = await prisma.tweet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TweetFindFirstArgs>(args?: SelectSubset<T, TweetFindFirstArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Tweet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetFindFirstOrThrowArgs} args - Arguments to find a Tweet
     * @example
     * // Get one Tweet
     * const tweet = await prisma.tweet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TweetFindFirstOrThrowArgs>(args?: SelectSubset<T, TweetFindFirstOrThrowArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tweets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tweets
     * const tweets = await prisma.tweet.findMany()
     * 
     * // Get first 10 Tweets
     * const tweets = await prisma.tweet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tweetWithIdOnly = await prisma.tweet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TweetFindManyArgs>(args?: SelectSubset<T, TweetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Tweet.
     * @param {TweetCreateArgs} args - Arguments to create a Tweet.
     * @example
     * // Create one Tweet
     * const Tweet = await prisma.tweet.create({
     *   data: {
     *     // ... data to create a Tweet
     *   }
     * })
     * 
     */
    create<T extends TweetCreateArgs>(args: SelectSubset<T, TweetCreateArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tweets.
     * @param {TweetCreateManyArgs} args - Arguments to create many Tweets.
     * @example
     * // Create many Tweets
     * const tweet = await prisma.tweet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TweetCreateManyArgs>(args?: SelectSubset<T, TweetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tweets and returns the data saved in the database.
     * @param {TweetCreateManyAndReturnArgs} args - Arguments to create many Tweets.
     * @example
     * // Create many Tweets
     * const tweet = await prisma.tweet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tweets and only return the `id`
     * const tweetWithIdOnly = await prisma.tweet.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TweetCreateManyAndReturnArgs>(args?: SelectSubset<T, TweetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Tweet.
     * @param {TweetDeleteArgs} args - Arguments to delete one Tweet.
     * @example
     * // Delete one Tweet
     * const Tweet = await prisma.tweet.delete({
     *   where: {
     *     // ... filter to delete one Tweet
     *   }
     * })
     * 
     */
    delete<T extends TweetDeleteArgs>(args: SelectSubset<T, TweetDeleteArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Tweet.
     * @param {TweetUpdateArgs} args - Arguments to update one Tweet.
     * @example
     * // Update one Tweet
     * const tweet = await prisma.tweet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TweetUpdateArgs>(args: SelectSubset<T, TweetUpdateArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tweets.
     * @param {TweetDeleteManyArgs} args - Arguments to filter Tweets to delete.
     * @example
     * // Delete a few Tweets
     * const { count } = await prisma.tweet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TweetDeleteManyArgs>(args?: SelectSubset<T, TweetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tweets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tweets
     * const tweet = await prisma.tweet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TweetUpdateManyArgs>(args: SelectSubset<T, TweetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tweet.
     * @param {TweetUpsertArgs} args - Arguments to update or create a Tweet.
     * @example
     * // Update or create a Tweet
     * const tweet = await prisma.tweet.upsert({
     *   create: {
     *     // ... data to create a Tweet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tweet we want to update
     *   }
     * })
     */
    upsert<T extends TweetUpsertArgs>(args: SelectSubset<T, TweetUpsertArgs<ExtArgs>>): Prisma__TweetClient<$Result.GetResult<Prisma.$TweetPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tweets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetCountArgs} args - Arguments to filter Tweets to count.
     * @example
     * // Count the number of Tweets
     * const count = await prisma.tweet.count({
     *   where: {
     *     // ... the filter for the Tweets we want to count
     *   }
     * })
    **/
    count<T extends TweetCountArgs>(
      args?: Subset<T, TweetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TweetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tweet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TweetAggregateArgs>(args: Subset<T, TweetAggregateArgs>): Prisma.PrismaPromise<GetTweetAggregateType<T>>

    /**
     * Group by Tweet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TweetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TweetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TweetGroupByArgs['orderBy'] }
        : { orderBy?: TweetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TweetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTweetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tweet model
   */
  readonly fields: TweetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tweet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TweetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tweet model
   */ 
  interface TweetFieldRefs {
    readonly id: FieldRef<"Tweet", 'String'>
    readonly author: FieldRef<"Tweet", 'String'>
    readonly handle: FieldRef<"Tweet", 'String'>
    readonly content: FieldRef<"Tweet", 'String'>
    readonly sentiment: FieldRef<"Tweet", 'Int'>
    readonly likes: FieldRef<"Tweet", 'Int'>
    readonly replies: FieldRef<"Tweet", 'Int'>
    readonly retweets: FieldRef<"Tweet", 'Int'>
    readonly url: FieldRef<"Tweet", 'String'>
    readonly avatarBg: FieldRef<"Tweet", 'String'>
    readonly avatarInitial: FieldRef<"Tweet", 'String'>
    readonly createdAt: FieldRef<"Tweet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tweet findUnique
   */
  export type TweetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * Filter, which Tweet to fetch.
     */
    where: TweetWhereUniqueInput
  }

  /**
   * Tweet findUniqueOrThrow
   */
  export type TweetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * Filter, which Tweet to fetch.
     */
    where: TweetWhereUniqueInput
  }

  /**
   * Tweet findFirst
   */
  export type TweetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * Filter, which Tweet to fetch.
     */
    where?: TweetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tweets to fetch.
     */
    orderBy?: TweetOrderByWithRelationInput | TweetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tweets.
     */
    cursor?: TweetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tweets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tweets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tweets.
     */
    distinct?: TweetScalarFieldEnum | TweetScalarFieldEnum[]
  }

  /**
   * Tweet findFirstOrThrow
   */
  export type TweetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * Filter, which Tweet to fetch.
     */
    where?: TweetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tweets to fetch.
     */
    orderBy?: TweetOrderByWithRelationInput | TweetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tweets.
     */
    cursor?: TweetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tweets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tweets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tweets.
     */
    distinct?: TweetScalarFieldEnum | TweetScalarFieldEnum[]
  }

  /**
   * Tweet findMany
   */
  export type TweetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * Filter, which Tweets to fetch.
     */
    where?: TweetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tweets to fetch.
     */
    orderBy?: TweetOrderByWithRelationInput | TweetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tweets.
     */
    cursor?: TweetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tweets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tweets.
     */
    skip?: number
    distinct?: TweetScalarFieldEnum | TweetScalarFieldEnum[]
  }

  /**
   * Tweet create
   */
  export type TweetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * The data needed to create a Tweet.
     */
    data: XOR<TweetCreateInput, TweetUncheckedCreateInput>
  }

  /**
   * Tweet createMany
   */
  export type TweetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tweets.
     */
    data: TweetCreateManyInput | TweetCreateManyInput[]
  }

  /**
   * Tweet createManyAndReturn
   */
  export type TweetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tweets.
     */
    data: TweetCreateManyInput | TweetCreateManyInput[]
  }

  /**
   * Tweet update
   */
  export type TweetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * The data needed to update a Tweet.
     */
    data: XOR<TweetUpdateInput, TweetUncheckedUpdateInput>
    /**
     * Choose, which Tweet to update.
     */
    where: TweetWhereUniqueInput
  }

  /**
   * Tweet updateMany
   */
  export type TweetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tweets.
     */
    data: XOR<TweetUpdateManyMutationInput, TweetUncheckedUpdateManyInput>
    /**
     * Filter which Tweets to update
     */
    where?: TweetWhereInput
  }

  /**
   * Tweet upsert
   */
  export type TweetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * The filter to search for the Tweet to update in case it exists.
     */
    where: TweetWhereUniqueInput
    /**
     * In case the Tweet found by the `where` argument doesn't exist, create a new Tweet with this data.
     */
    create: XOR<TweetCreateInput, TweetUncheckedCreateInput>
    /**
     * In case the Tweet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TweetUpdateInput, TweetUncheckedUpdateInput>
  }

  /**
   * Tweet delete
   */
  export type TweetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
    /**
     * Filter which Tweet to delete.
     */
    where: TweetWhereUniqueInput
  }

  /**
   * Tweet deleteMany
   */
  export type TweetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tweets to delete
     */
    where?: TweetWhereInput
  }

  /**
   * Tweet without action
   */
  export type TweetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tweet
     */
    select?: TweetSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PlayerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    team: 'team',
    position: 'position',
    sentiment: 'sentiment',
    tweets: 'tweets',
    aiConfidence: 'aiConfidence',
    form: 'form',
    lastUpdated: 'lastUpdated'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const MatchScalarFieldEnum: {
    id: 'id',
    homeTeam: 'homeTeam',
    awayTeam: 'awayTeam',
    homeScore: 'homeScore',
    awayScore: 'awayScore',
    status: 'status',
    league: 'league',
    round: 'round',
    date: 'date',
    aggregateScore: 'aggregateScore',
    homeSentiment: 'homeSentiment',
    awaySentiment: 'awaySentiment',
    psycheJSON: 'psycheJSON',
    events: 'events',
    lastUpdated: 'lastUpdated'
  };

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const SentimentScalarFieldEnum: {
    id: 'id',
    playerId: 'playerId',
    matchId: 'matchId',
    score: 'score',
    source: 'source',
    themes: 'themes',
    breakdown: 'breakdown',
    timestamp: 'timestamp'
  };

  export type SentimentScalarFieldEnum = (typeof SentimentScalarFieldEnum)[keyof typeof SentimentScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    role: 'role',
    assignedTeam: 'assignedTeam',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DataSourceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    url: 'url',
    isActive: 'isActive',
    lastScraped: 'lastScraped',
    userId: 'userId',
    matchId: 'matchId',
    clubId: 'clubId'
  };

  export type DataSourceScalarFieldEnum = (typeof DataSourceScalarFieldEnum)[keyof typeof DataSourceScalarFieldEnum]


  export const TweetScalarFieldEnum: {
    id: 'id',
    author: 'author',
    handle: 'handle',
    content: 'content',
    sentiment: 'sentiment',
    likes: 'likes',
    replies: 'replies',
    retweets: 'retweets',
    url: 'url',
    avatarBg: 'avatarBg',
    avatarInitial: 'avatarInitial',
    createdAt: 'createdAt'
  };

  export type TweetScalarFieldEnum = (typeof TweetScalarFieldEnum)[keyof typeof TweetScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type PlayerWhereInput = {
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    id?: StringFilter<"Player"> | string
    name?: StringFilter<"Player"> | string
    team?: StringFilter<"Player"> | string
    position?: StringFilter<"Player"> | string
    sentiment?: IntFilter<"Player"> | number
    tweets?: IntFilter<"Player"> | number
    aiConfidence?: FloatFilter<"Player"> | number
    form?: StringFilter<"Player"> | string
    lastUpdated?: DateTimeFilter<"Player"> | Date | string
    sentiments?: SentimentListRelationFilter
  }

  export type PlayerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    team?: SortOrder
    position?: SortOrder
    sentiment?: SortOrder
    tweets?: SortOrder
    aiConfidence?: SortOrder
    form?: SortOrder
    lastUpdated?: SortOrder
    sentiments?: SentimentOrderByRelationAggregateInput
  }

  export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    name?: StringFilter<"Player"> | string
    team?: StringFilter<"Player"> | string
    position?: StringFilter<"Player"> | string
    sentiment?: IntFilter<"Player"> | number
    tweets?: IntFilter<"Player"> | number
    aiConfidence?: FloatFilter<"Player"> | number
    form?: StringFilter<"Player"> | string
    lastUpdated?: DateTimeFilter<"Player"> | Date | string
    sentiments?: SentimentListRelationFilter
  }, "id">

  export type PlayerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    team?: SortOrder
    position?: SortOrder
    sentiment?: SortOrder
    tweets?: SortOrder
    aiConfidence?: SortOrder
    form?: SortOrder
    lastUpdated?: SortOrder
    _count?: PlayerCountOrderByAggregateInput
    _avg?: PlayerAvgOrderByAggregateInput
    _max?: PlayerMaxOrderByAggregateInput
    _min?: PlayerMinOrderByAggregateInput
    _sum?: PlayerSumOrderByAggregateInput
  }

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    OR?: PlayerScalarWhereWithAggregatesInput[]
    NOT?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Player"> | string
    name?: StringWithAggregatesFilter<"Player"> | string
    team?: StringWithAggregatesFilter<"Player"> | string
    position?: StringWithAggregatesFilter<"Player"> | string
    sentiment?: IntWithAggregatesFilter<"Player"> | number
    tweets?: IntWithAggregatesFilter<"Player"> | number
    aiConfidence?: FloatWithAggregatesFilter<"Player"> | number
    form?: StringWithAggregatesFilter<"Player"> | string
    lastUpdated?: DateTimeWithAggregatesFilter<"Player"> | Date | string
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: StringFilter<"Match"> | string
    homeTeam?: StringFilter<"Match"> | string
    awayTeam?: StringFilter<"Match"> | string
    homeScore?: IntFilter<"Match"> | number
    awayScore?: IntFilter<"Match"> | number
    status?: StringFilter<"Match"> | string
    league?: StringFilter<"Match"> | string
    round?: StringNullableFilter<"Match"> | string | null
    date?: DateTimeFilter<"Match"> | Date | string
    aggregateScore?: StringNullableFilter<"Match"> | string | null
    homeSentiment?: IntFilter<"Match"> | number
    awaySentiment?: IntFilter<"Match"> | number
    psycheJSON?: StringNullableFilter<"Match"> | string | null
    events?: StringNullableFilter<"Match"> | string | null
    lastUpdated?: DateTimeFilter<"Match"> | Date | string
    sentiments?: SentimentListRelationFilter
    dataSources?: DataSourceListRelationFilter
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    status?: SortOrder
    league?: SortOrder
    round?: SortOrderInput | SortOrder
    date?: SortOrder
    aggregateScore?: SortOrderInput | SortOrder
    homeSentiment?: SortOrder
    awaySentiment?: SortOrder
    psycheJSON?: SortOrderInput | SortOrder
    events?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    sentiments?: SentimentOrderByRelationAggregateInput
    dataSources?: DataSourceOrderByRelationAggregateInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    homeTeam?: StringFilter<"Match"> | string
    awayTeam?: StringFilter<"Match"> | string
    homeScore?: IntFilter<"Match"> | number
    awayScore?: IntFilter<"Match"> | number
    status?: StringFilter<"Match"> | string
    league?: StringFilter<"Match"> | string
    round?: StringNullableFilter<"Match"> | string | null
    date?: DateTimeFilter<"Match"> | Date | string
    aggregateScore?: StringNullableFilter<"Match"> | string | null
    homeSentiment?: IntFilter<"Match"> | number
    awaySentiment?: IntFilter<"Match"> | number
    psycheJSON?: StringNullableFilter<"Match"> | string | null
    events?: StringNullableFilter<"Match"> | string | null
    lastUpdated?: DateTimeFilter<"Match"> | Date | string
    sentiments?: SentimentListRelationFilter
    dataSources?: DataSourceListRelationFilter
  }, "id">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    status?: SortOrder
    league?: SortOrder
    round?: SortOrderInput | SortOrder
    date?: SortOrder
    aggregateScore?: SortOrderInput | SortOrder
    homeSentiment?: SortOrder
    awaySentiment?: SortOrder
    psycheJSON?: SortOrderInput | SortOrder
    events?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Match"> | string
    homeTeam?: StringWithAggregatesFilter<"Match"> | string
    awayTeam?: StringWithAggregatesFilter<"Match"> | string
    homeScore?: IntWithAggregatesFilter<"Match"> | number
    awayScore?: IntWithAggregatesFilter<"Match"> | number
    status?: StringWithAggregatesFilter<"Match"> | string
    league?: StringWithAggregatesFilter<"Match"> | string
    round?: StringNullableWithAggregatesFilter<"Match"> | string | null
    date?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    aggregateScore?: StringNullableWithAggregatesFilter<"Match"> | string | null
    homeSentiment?: IntWithAggregatesFilter<"Match"> | number
    awaySentiment?: IntWithAggregatesFilter<"Match"> | number
    psycheJSON?: StringNullableWithAggregatesFilter<"Match"> | string | null
    events?: StringNullableWithAggregatesFilter<"Match"> | string | null
    lastUpdated?: DateTimeWithAggregatesFilter<"Match"> | Date | string
  }

  export type SentimentWhereInput = {
    AND?: SentimentWhereInput | SentimentWhereInput[]
    OR?: SentimentWhereInput[]
    NOT?: SentimentWhereInput | SentimentWhereInput[]
    id?: StringFilter<"Sentiment"> | string
    playerId?: StringNullableFilter<"Sentiment"> | string | null
    matchId?: StringNullableFilter<"Sentiment"> | string | null
    score?: IntFilter<"Sentiment"> | number
    source?: StringFilter<"Sentiment"> | string
    themes?: StringFilter<"Sentiment"> | string
    breakdown?: StringFilter<"Sentiment"> | string
    timestamp?: DateTimeFilter<"Sentiment"> | Date | string
    match?: XOR<MatchNullableRelationFilter, MatchWhereInput> | null
    player?: XOR<PlayerNullableRelationFilter, PlayerWhereInput> | null
  }

  export type SentimentOrderByWithRelationInput = {
    id?: SortOrder
    playerId?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    score?: SortOrder
    source?: SortOrder
    themes?: SortOrder
    breakdown?: SortOrder
    timestamp?: SortOrder
    match?: MatchOrderByWithRelationInput
    player?: PlayerOrderByWithRelationInput
  }

  export type SentimentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SentimentWhereInput | SentimentWhereInput[]
    OR?: SentimentWhereInput[]
    NOT?: SentimentWhereInput | SentimentWhereInput[]
    playerId?: StringNullableFilter<"Sentiment"> | string | null
    matchId?: StringNullableFilter<"Sentiment"> | string | null
    score?: IntFilter<"Sentiment"> | number
    source?: StringFilter<"Sentiment"> | string
    themes?: StringFilter<"Sentiment"> | string
    breakdown?: StringFilter<"Sentiment"> | string
    timestamp?: DateTimeFilter<"Sentiment"> | Date | string
    match?: XOR<MatchNullableRelationFilter, MatchWhereInput> | null
    player?: XOR<PlayerNullableRelationFilter, PlayerWhereInput> | null
  }, "id">

  export type SentimentOrderByWithAggregationInput = {
    id?: SortOrder
    playerId?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    score?: SortOrder
    source?: SortOrder
    themes?: SortOrder
    breakdown?: SortOrder
    timestamp?: SortOrder
    _count?: SentimentCountOrderByAggregateInput
    _avg?: SentimentAvgOrderByAggregateInput
    _max?: SentimentMaxOrderByAggregateInput
    _min?: SentimentMinOrderByAggregateInput
    _sum?: SentimentSumOrderByAggregateInput
  }

  export type SentimentScalarWhereWithAggregatesInput = {
    AND?: SentimentScalarWhereWithAggregatesInput | SentimentScalarWhereWithAggregatesInput[]
    OR?: SentimentScalarWhereWithAggregatesInput[]
    NOT?: SentimentScalarWhereWithAggregatesInput | SentimentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Sentiment"> | string
    playerId?: StringNullableWithAggregatesFilter<"Sentiment"> | string | null
    matchId?: StringNullableWithAggregatesFilter<"Sentiment"> | string | null
    score?: IntWithAggregatesFilter<"Sentiment"> | number
    source?: StringWithAggregatesFilter<"Sentiment"> | string
    themes?: StringWithAggregatesFilter<"Sentiment"> | string
    breakdown?: StringWithAggregatesFilter<"Sentiment"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Sentiment"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    assignedTeam?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    dataSources?: DataSourceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    assignedTeam?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    dataSources?: DataSourceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    assignedTeam?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    dataSources?: DataSourceListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    assignedTeam?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    assignedTeam?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type DataSourceWhereInput = {
    AND?: DataSourceWhereInput | DataSourceWhereInput[]
    OR?: DataSourceWhereInput[]
    NOT?: DataSourceWhereInput | DataSourceWhereInput[]
    id?: StringFilter<"DataSource"> | string
    name?: StringFilter<"DataSource"> | string
    type?: StringFilter<"DataSource"> | string
    url?: StringFilter<"DataSource"> | string
    isActive?: BoolFilter<"DataSource"> | boolean
    lastScraped?: DateTimeFilter<"DataSource"> | Date | string
    userId?: StringNullableFilter<"DataSource"> | string | null
    matchId?: StringNullableFilter<"DataSource"> | string | null
    clubId?: StringNullableFilter<"DataSource"> | string | null
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    match?: XOR<MatchNullableRelationFilter, MatchWhereInput> | null
  }

  export type DataSourceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    isActive?: SortOrder
    lastScraped?: SortOrder
    userId?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    clubId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    match?: MatchOrderByWithRelationInput
  }

  export type DataSourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DataSourceWhereInput | DataSourceWhereInput[]
    OR?: DataSourceWhereInput[]
    NOT?: DataSourceWhereInput | DataSourceWhereInput[]
    name?: StringFilter<"DataSource"> | string
    type?: StringFilter<"DataSource"> | string
    url?: StringFilter<"DataSource"> | string
    isActive?: BoolFilter<"DataSource"> | boolean
    lastScraped?: DateTimeFilter<"DataSource"> | Date | string
    userId?: StringNullableFilter<"DataSource"> | string | null
    matchId?: StringNullableFilter<"DataSource"> | string | null
    clubId?: StringNullableFilter<"DataSource"> | string | null
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    match?: XOR<MatchNullableRelationFilter, MatchWhereInput> | null
  }, "id">

  export type DataSourceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    isActive?: SortOrder
    lastScraped?: SortOrder
    userId?: SortOrderInput | SortOrder
    matchId?: SortOrderInput | SortOrder
    clubId?: SortOrderInput | SortOrder
    _count?: DataSourceCountOrderByAggregateInput
    _max?: DataSourceMaxOrderByAggregateInput
    _min?: DataSourceMinOrderByAggregateInput
  }

  export type DataSourceScalarWhereWithAggregatesInput = {
    AND?: DataSourceScalarWhereWithAggregatesInput | DataSourceScalarWhereWithAggregatesInput[]
    OR?: DataSourceScalarWhereWithAggregatesInput[]
    NOT?: DataSourceScalarWhereWithAggregatesInput | DataSourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DataSource"> | string
    name?: StringWithAggregatesFilter<"DataSource"> | string
    type?: StringWithAggregatesFilter<"DataSource"> | string
    url?: StringWithAggregatesFilter<"DataSource"> | string
    isActive?: BoolWithAggregatesFilter<"DataSource"> | boolean
    lastScraped?: DateTimeWithAggregatesFilter<"DataSource"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"DataSource"> | string | null
    matchId?: StringNullableWithAggregatesFilter<"DataSource"> | string | null
    clubId?: StringNullableWithAggregatesFilter<"DataSource"> | string | null
  }

  export type TweetWhereInput = {
    AND?: TweetWhereInput | TweetWhereInput[]
    OR?: TweetWhereInput[]
    NOT?: TweetWhereInput | TweetWhereInput[]
    id?: StringFilter<"Tweet"> | string
    author?: StringFilter<"Tweet"> | string
    handle?: StringFilter<"Tweet"> | string
    content?: StringFilter<"Tweet"> | string
    sentiment?: IntFilter<"Tweet"> | number
    likes?: IntFilter<"Tweet"> | number
    replies?: IntFilter<"Tweet"> | number
    retweets?: IntFilter<"Tweet"> | number
    url?: StringFilter<"Tweet"> | string
    avatarBg?: StringFilter<"Tweet"> | string
    avatarInitial?: StringFilter<"Tweet"> | string
    createdAt?: DateTimeFilter<"Tweet"> | Date | string
  }

  export type TweetOrderByWithRelationInput = {
    id?: SortOrder
    author?: SortOrder
    handle?: SortOrder
    content?: SortOrder
    sentiment?: SortOrder
    likes?: SortOrder
    replies?: SortOrder
    retweets?: SortOrder
    url?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    createdAt?: SortOrder
  }

  export type TweetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TweetWhereInput | TweetWhereInput[]
    OR?: TweetWhereInput[]
    NOT?: TweetWhereInput | TweetWhereInput[]
    author?: StringFilter<"Tweet"> | string
    handle?: StringFilter<"Tweet"> | string
    content?: StringFilter<"Tweet"> | string
    sentiment?: IntFilter<"Tweet"> | number
    likes?: IntFilter<"Tweet"> | number
    replies?: IntFilter<"Tweet"> | number
    retweets?: IntFilter<"Tweet"> | number
    url?: StringFilter<"Tweet"> | string
    avatarBg?: StringFilter<"Tweet"> | string
    avatarInitial?: StringFilter<"Tweet"> | string
    createdAt?: DateTimeFilter<"Tweet"> | Date | string
  }, "id">

  export type TweetOrderByWithAggregationInput = {
    id?: SortOrder
    author?: SortOrder
    handle?: SortOrder
    content?: SortOrder
    sentiment?: SortOrder
    likes?: SortOrder
    replies?: SortOrder
    retweets?: SortOrder
    url?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    createdAt?: SortOrder
    _count?: TweetCountOrderByAggregateInput
    _avg?: TweetAvgOrderByAggregateInput
    _max?: TweetMaxOrderByAggregateInput
    _min?: TweetMinOrderByAggregateInput
    _sum?: TweetSumOrderByAggregateInput
  }

  export type TweetScalarWhereWithAggregatesInput = {
    AND?: TweetScalarWhereWithAggregatesInput | TweetScalarWhereWithAggregatesInput[]
    OR?: TweetScalarWhereWithAggregatesInput[]
    NOT?: TweetScalarWhereWithAggregatesInput | TweetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tweet"> | string
    author?: StringWithAggregatesFilter<"Tweet"> | string
    handle?: StringWithAggregatesFilter<"Tweet"> | string
    content?: StringWithAggregatesFilter<"Tweet"> | string
    sentiment?: IntWithAggregatesFilter<"Tweet"> | number
    likes?: IntWithAggregatesFilter<"Tweet"> | number
    replies?: IntWithAggregatesFilter<"Tweet"> | number
    retweets?: IntWithAggregatesFilter<"Tweet"> | number
    url?: StringWithAggregatesFilter<"Tweet"> | string
    avatarBg?: StringWithAggregatesFilter<"Tweet"> | string
    avatarInitial?: StringWithAggregatesFilter<"Tweet"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tweet"> | Date | string
  }

  export type PlayerCreateInput = {
    id?: string
    name: string
    team: string
    position: string
    sentiment: number
    tweets: number
    aiConfidence: number
    form: string
    lastUpdated?: Date | string
    sentiments?: SentimentCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateInput = {
    id?: string
    name: string
    team: string
    position: string
    sentiment: number
    tweets: number
    aiConfidence: number
    form: string
    lastUpdated?: Date | string
    sentiments?: SentimentUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    tweets?: IntFieldUpdateOperationsInput | number
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    form?: StringFieldUpdateOperationsInput | string
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    sentiments?: SentimentUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    tweets?: IntFieldUpdateOperationsInput | number
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    form?: StringFieldUpdateOperationsInput | string
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    sentiments?: SentimentUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerCreateManyInput = {
    id?: string
    name: string
    team: string
    position: string
    sentiment: number
    tweets: number
    aiConfidence: number
    form: string
    lastUpdated?: Date | string
  }

  export type PlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    tweets?: IntFieldUpdateOperationsInput | number
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    form?: StringFieldUpdateOperationsInput | string
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    tweets?: IntFieldUpdateOperationsInput | number
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    form?: StringFieldUpdateOperationsInput | string
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchCreateInput = {
    id?: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round?: string | null
    date: Date | string
    aggregateScore?: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON?: string | null
    events?: string | null
    lastUpdated?: Date | string
    sentiments?: SentimentCreateNestedManyWithoutMatchInput
    dataSources?: DataSourceCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateInput = {
    id?: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round?: string | null
    date: Date | string
    aggregateScore?: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON?: string | null
    events?: string | null
    lastUpdated?: Date | string
    sentiments?: SentimentUncheckedCreateNestedManyWithoutMatchInput
    dataSources?: DataSourceUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    sentiments?: SentimentUpdateManyWithoutMatchNestedInput
    dataSources?: DataSourceUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    sentiments?: SentimentUncheckedUpdateManyWithoutMatchNestedInput
    dataSources?: DataSourceUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchCreateManyInput = {
    id?: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round?: string | null
    date: Date | string
    aggregateScore?: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON?: string | null
    events?: string | null
    lastUpdated?: Date | string
  }

  export type MatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentCreateInput = {
    id?: string
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
    match?: MatchCreateNestedOneWithoutSentimentsInput
    player?: PlayerCreateNestedOneWithoutSentimentsInput
  }

  export type SentimentUncheckedCreateInput = {
    id?: string
    playerId?: string | null
    matchId?: string | null
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
  }

  export type SentimentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneWithoutSentimentsNestedInput
    player?: PlayerUpdateOneWithoutSentimentsNestedInput
  }

  export type SentimentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentCreateManyInput = {
    id?: string
    playerId?: string | null
    matchId?: string | null
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
  }

  export type SentimentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    password: string
    role?: string
    assignedTeam?: string | null
    createdAt?: Date | string
    dataSources?: DataSourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    password: string
    role?: string
    assignedTeam?: string | null
    createdAt?: Date | string
    dataSources?: DataSourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    assignedTeam?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSources?: DataSourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    assignedTeam?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSources?: DataSourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    password: string
    role?: string
    assignedTeam?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    assignedTeam?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    assignedTeam?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataSourceCreateInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    clubId?: string | null
    user?: UserCreateNestedOneWithoutDataSourcesInput
    match?: MatchCreateNestedOneWithoutDataSourcesInput
  }

  export type DataSourceUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    userId?: string | null
    matchId?: string | null
    clubId?: string | null
  }

  export type DataSourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutDataSourcesNestedInput
    match?: MatchUpdateOneWithoutDataSourcesNestedInput
  }

  export type DataSourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataSourceCreateManyInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    userId?: string | null
    matchId?: string | null
    clubId?: string | null
  }

  export type DataSourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataSourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TweetCreateInput = {
    id?: string
    author: string
    handle: string
    content: string
    sentiment: number
    likes?: number
    replies?: number
    retweets?: number
    url: string
    avatarBg: string
    avatarInitial: string
    createdAt?: Date | string
  }

  export type TweetUncheckedCreateInput = {
    id?: string
    author: string
    handle: string
    content: string
    sentiment: number
    likes?: number
    replies?: number
    retweets?: number
    url: string
    avatarBg: string
    avatarInitial: string
    createdAt?: Date | string
  }

  export type TweetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    replies?: IntFieldUpdateOperationsInput | number
    retweets?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TweetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    replies?: IntFieldUpdateOperationsInput | number
    retweets?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TweetCreateManyInput = {
    id?: string
    author: string
    handle: string
    content: string
    sentiment: number
    likes?: number
    replies?: number
    retweets?: number
    url: string
    avatarBg: string
    avatarInitial: string
    createdAt?: Date | string
  }

  export type TweetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    replies?: IntFieldUpdateOperationsInput | number
    retweets?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TweetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    handle?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    replies?: IntFieldUpdateOperationsInput | number
    retweets?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SentimentListRelationFilter = {
    every?: SentimentWhereInput
    some?: SentimentWhereInput
    none?: SentimentWhereInput
  }

  export type SentimentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    team?: SortOrder
    position?: SortOrder
    sentiment?: SortOrder
    tweets?: SortOrder
    aiConfidence?: SortOrder
    form?: SortOrder
    lastUpdated?: SortOrder
  }

  export type PlayerAvgOrderByAggregateInput = {
    sentiment?: SortOrder
    tweets?: SortOrder
    aiConfidence?: SortOrder
  }

  export type PlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    team?: SortOrder
    position?: SortOrder
    sentiment?: SortOrder
    tweets?: SortOrder
    aiConfidence?: SortOrder
    form?: SortOrder
    lastUpdated?: SortOrder
  }

  export type PlayerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    team?: SortOrder
    position?: SortOrder
    sentiment?: SortOrder
    tweets?: SortOrder
    aiConfidence?: SortOrder
    form?: SortOrder
    lastUpdated?: SortOrder
  }

  export type PlayerSumOrderByAggregateInput = {
    sentiment?: SortOrder
    tweets?: SortOrder
    aiConfidence?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DataSourceListRelationFilter = {
    every?: DataSourceWhereInput
    some?: DataSourceWhereInput
    none?: DataSourceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DataSourceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    status?: SortOrder
    league?: SortOrder
    round?: SortOrder
    date?: SortOrder
    aggregateScore?: SortOrder
    homeSentiment?: SortOrder
    awaySentiment?: SortOrder
    psycheJSON?: SortOrder
    events?: SortOrder
    lastUpdated?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    homeScore?: SortOrder
    awayScore?: SortOrder
    homeSentiment?: SortOrder
    awaySentiment?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    status?: SortOrder
    league?: SortOrder
    round?: SortOrder
    date?: SortOrder
    aggregateScore?: SortOrder
    homeSentiment?: SortOrder
    awaySentiment?: SortOrder
    psycheJSON?: SortOrder
    events?: SortOrder
    lastUpdated?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    homeTeam?: SortOrder
    awayTeam?: SortOrder
    homeScore?: SortOrder
    awayScore?: SortOrder
    status?: SortOrder
    league?: SortOrder
    round?: SortOrder
    date?: SortOrder
    aggregateScore?: SortOrder
    homeSentiment?: SortOrder
    awaySentiment?: SortOrder
    psycheJSON?: SortOrder
    events?: SortOrder
    lastUpdated?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    homeScore?: SortOrder
    awayScore?: SortOrder
    homeSentiment?: SortOrder
    awaySentiment?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type MatchNullableRelationFilter = {
    is?: MatchWhereInput | null
    isNot?: MatchWhereInput | null
  }

  export type PlayerNullableRelationFilter = {
    is?: PlayerWhereInput | null
    isNot?: PlayerWhereInput | null
  }

  export type SentimentCountOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    matchId?: SortOrder
    score?: SortOrder
    source?: SortOrder
    themes?: SortOrder
    breakdown?: SortOrder
    timestamp?: SortOrder
  }

  export type SentimentAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type SentimentMaxOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    matchId?: SortOrder
    score?: SortOrder
    source?: SortOrder
    themes?: SortOrder
    breakdown?: SortOrder
    timestamp?: SortOrder
  }

  export type SentimentMinOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    matchId?: SortOrder
    score?: SortOrder
    source?: SortOrder
    themes?: SortOrder
    breakdown?: SortOrder
    timestamp?: SortOrder
  }

  export type SentimentSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    assignedTeam?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    assignedTeam?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    assignedTeam?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type DataSourceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    isActive?: SortOrder
    lastScraped?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    clubId?: SortOrder
  }

  export type DataSourceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    isActive?: SortOrder
    lastScraped?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    clubId?: SortOrder
  }

  export type DataSourceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    url?: SortOrder
    isActive?: SortOrder
    lastScraped?: SortOrder
    userId?: SortOrder
    matchId?: SortOrder
    clubId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TweetCountOrderByAggregateInput = {
    id?: SortOrder
    author?: SortOrder
    handle?: SortOrder
    content?: SortOrder
    sentiment?: SortOrder
    likes?: SortOrder
    replies?: SortOrder
    retweets?: SortOrder
    url?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    createdAt?: SortOrder
  }

  export type TweetAvgOrderByAggregateInput = {
    sentiment?: SortOrder
    likes?: SortOrder
    replies?: SortOrder
    retweets?: SortOrder
  }

  export type TweetMaxOrderByAggregateInput = {
    id?: SortOrder
    author?: SortOrder
    handle?: SortOrder
    content?: SortOrder
    sentiment?: SortOrder
    likes?: SortOrder
    replies?: SortOrder
    retweets?: SortOrder
    url?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    createdAt?: SortOrder
  }

  export type TweetMinOrderByAggregateInput = {
    id?: SortOrder
    author?: SortOrder
    handle?: SortOrder
    content?: SortOrder
    sentiment?: SortOrder
    likes?: SortOrder
    replies?: SortOrder
    retweets?: SortOrder
    url?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    createdAt?: SortOrder
  }

  export type TweetSumOrderByAggregateInput = {
    sentiment?: SortOrder
    likes?: SortOrder
    replies?: SortOrder
    retweets?: SortOrder
  }

  export type SentimentCreateNestedManyWithoutPlayerInput = {
    create?: XOR<SentimentCreateWithoutPlayerInput, SentimentUncheckedCreateWithoutPlayerInput> | SentimentCreateWithoutPlayerInput[] | SentimentUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutPlayerInput | SentimentCreateOrConnectWithoutPlayerInput[]
    createMany?: SentimentCreateManyPlayerInputEnvelope
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
  }

  export type SentimentUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<SentimentCreateWithoutPlayerInput, SentimentUncheckedCreateWithoutPlayerInput> | SentimentCreateWithoutPlayerInput[] | SentimentUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutPlayerInput | SentimentCreateOrConnectWithoutPlayerInput[]
    createMany?: SentimentCreateManyPlayerInputEnvelope
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SentimentUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<SentimentCreateWithoutPlayerInput, SentimentUncheckedCreateWithoutPlayerInput> | SentimentCreateWithoutPlayerInput[] | SentimentUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutPlayerInput | SentimentCreateOrConnectWithoutPlayerInput[]
    upsert?: SentimentUpsertWithWhereUniqueWithoutPlayerInput | SentimentUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: SentimentCreateManyPlayerInputEnvelope
    set?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    disconnect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    delete?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    update?: SentimentUpdateWithWhereUniqueWithoutPlayerInput | SentimentUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: SentimentUpdateManyWithWhereWithoutPlayerInput | SentimentUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: SentimentScalarWhereInput | SentimentScalarWhereInput[]
  }

  export type SentimentUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<SentimentCreateWithoutPlayerInput, SentimentUncheckedCreateWithoutPlayerInput> | SentimentCreateWithoutPlayerInput[] | SentimentUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutPlayerInput | SentimentCreateOrConnectWithoutPlayerInput[]
    upsert?: SentimentUpsertWithWhereUniqueWithoutPlayerInput | SentimentUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: SentimentCreateManyPlayerInputEnvelope
    set?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    disconnect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    delete?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    update?: SentimentUpdateWithWhereUniqueWithoutPlayerInput | SentimentUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: SentimentUpdateManyWithWhereWithoutPlayerInput | SentimentUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: SentimentScalarWhereInput | SentimentScalarWhereInput[]
  }

  export type SentimentCreateNestedManyWithoutMatchInput = {
    create?: XOR<SentimentCreateWithoutMatchInput, SentimentUncheckedCreateWithoutMatchInput> | SentimentCreateWithoutMatchInput[] | SentimentUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutMatchInput | SentimentCreateOrConnectWithoutMatchInput[]
    createMany?: SentimentCreateManyMatchInputEnvelope
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
  }

  export type DataSourceCreateNestedManyWithoutMatchInput = {
    create?: XOR<DataSourceCreateWithoutMatchInput, DataSourceUncheckedCreateWithoutMatchInput> | DataSourceCreateWithoutMatchInput[] | DataSourceUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutMatchInput | DataSourceCreateOrConnectWithoutMatchInput[]
    createMany?: DataSourceCreateManyMatchInputEnvelope
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
  }

  export type SentimentUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<SentimentCreateWithoutMatchInput, SentimentUncheckedCreateWithoutMatchInput> | SentimentCreateWithoutMatchInput[] | SentimentUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutMatchInput | SentimentCreateOrConnectWithoutMatchInput[]
    createMany?: SentimentCreateManyMatchInputEnvelope
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
  }

  export type DataSourceUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<DataSourceCreateWithoutMatchInput, DataSourceUncheckedCreateWithoutMatchInput> | DataSourceCreateWithoutMatchInput[] | DataSourceUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutMatchInput | DataSourceCreateOrConnectWithoutMatchInput[]
    createMany?: DataSourceCreateManyMatchInputEnvelope
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type SentimentUpdateManyWithoutMatchNestedInput = {
    create?: XOR<SentimentCreateWithoutMatchInput, SentimentUncheckedCreateWithoutMatchInput> | SentimentCreateWithoutMatchInput[] | SentimentUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutMatchInput | SentimentCreateOrConnectWithoutMatchInput[]
    upsert?: SentimentUpsertWithWhereUniqueWithoutMatchInput | SentimentUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: SentimentCreateManyMatchInputEnvelope
    set?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    disconnect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    delete?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    update?: SentimentUpdateWithWhereUniqueWithoutMatchInput | SentimentUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: SentimentUpdateManyWithWhereWithoutMatchInput | SentimentUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: SentimentScalarWhereInput | SentimentScalarWhereInput[]
  }

  export type DataSourceUpdateManyWithoutMatchNestedInput = {
    create?: XOR<DataSourceCreateWithoutMatchInput, DataSourceUncheckedCreateWithoutMatchInput> | DataSourceCreateWithoutMatchInput[] | DataSourceUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutMatchInput | DataSourceCreateOrConnectWithoutMatchInput[]
    upsert?: DataSourceUpsertWithWhereUniqueWithoutMatchInput | DataSourceUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: DataSourceCreateManyMatchInputEnvelope
    set?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    disconnect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    delete?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    update?: DataSourceUpdateWithWhereUniqueWithoutMatchInput | DataSourceUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: DataSourceUpdateManyWithWhereWithoutMatchInput | DataSourceUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: DataSourceScalarWhereInput | DataSourceScalarWhereInput[]
  }

  export type SentimentUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<SentimentCreateWithoutMatchInput, SentimentUncheckedCreateWithoutMatchInput> | SentimentCreateWithoutMatchInput[] | SentimentUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: SentimentCreateOrConnectWithoutMatchInput | SentimentCreateOrConnectWithoutMatchInput[]
    upsert?: SentimentUpsertWithWhereUniqueWithoutMatchInput | SentimentUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: SentimentCreateManyMatchInputEnvelope
    set?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    disconnect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    delete?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    connect?: SentimentWhereUniqueInput | SentimentWhereUniqueInput[]
    update?: SentimentUpdateWithWhereUniqueWithoutMatchInput | SentimentUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: SentimentUpdateManyWithWhereWithoutMatchInput | SentimentUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: SentimentScalarWhereInput | SentimentScalarWhereInput[]
  }

  export type DataSourceUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<DataSourceCreateWithoutMatchInput, DataSourceUncheckedCreateWithoutMatchInput> | DataSourceCreateWithoutMatchInput[] | DataSourceUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutMatchInput | DataSourceCreateOrConnectWithoutMatchInput[]
    upsert?: DataSourceUpsertWithWhereUniqueWithoutMatchInput | DataSourceUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: DataSourceCreateManyMatchInputEnvelope
    set?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    disconnect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    delete?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    update?: DataSourceUpdateWithWhereUniqueWithoutMatchInput | DataSourceUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: DataSourceUpdateManyWithWhereWithoutMatchInput | DataSourceUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: DataSourceScalarWhereInput | DataSourceScalarWhereInput[]
  }

  export type MatchCreateNestedOneWithoutSentimentsInput = {
    create?: XOR<MatchCreateWithoutSentimentsInput, MatchUncheckedCreateWithoutSentimentsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutSentimentsInput
    connect?: MatchWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutSentimentsInput = {
    create?: XOR<PlayerCreateWithoutSentimentsInput, PlayerUncheckedCreateWithoutSentimentsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutSentimentsInput
    connect?: PlayerWhereUniqueInput
  }

  export type MatchUpdateOneWithoutSentimentsNestedInput = {
    create?: XOR<MatchCreateWithoutSentimentsInput, MatchUncheckedCreateWithoutSentimentsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutSentimentsInput
    upsert?: MatchUpsertWithoutSentimentsInput
    disconnect?: MatchWhereInput | boolean
    delete?: MatchWhereInput | boolean
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutSentimentsInput, MatchUpdateWithoutSentimentsInput>, MatchUncheckedUpdateWithoutSentimentsInput>
  }

  export type PlayerUpdateOneWithoutSentimentsNestedInput = {
    create?: XOR<PlayerCreateWithoutSentimentsInput, PlayerUncheckedCreateWithoutSentimentsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutSentimentsInput
    upsert?: PlayerUpsertWithoutSentimentsInput
    disconnect?: PlayerWhereInput | boolean
    delete?: PlayerWhereInput | boolean
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutSentimentsInput, PlayerUpdateWithoutSentimentsInput>, PlayerUncheckedUpdateWithoutSentimentsInput>
  }

  export type DataSourceCreateNestedManyWithoutUserInput = {
    create?: XOR<DataSourceCreateWithoutUserInput, DataSourceUncheckedCreateWithoutUserInput> | DataSourceCreateWithoutUserInput[] | DataSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutUserInput | DataSourceCreateOrConnectWithoutUserInput[]
    createMany?: DataSourceCreateManyUserInputEnvelope
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
  }

  export type DataSourceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DataSourceCreateWithoutUserInput, DataSourceUncheckedCreateWithoutUserInput> | DataSourceCreateWithoutUserInput[] | DataSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutUserInput | DataSourceCreateOrConnectWithoutUserInput[]
    createMany?: DataSourceCreateManyUserInputEnvelope
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
  }

  export type DataSourceUpdateManyWithoutUserNestedInput = {
    create?: XOR<DataSourceCreateWithoutUserInput, DataSourceUncheckedCreateWithoutUserInput> | DataSourceCreateWithoutUserInput[] | DataSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutUserInput | DataSourceCreateOrConnectWithoutUserInput[]
    upsert?: DataSourceUpsertWithWhereUniqueWithoutUserInput | DataSourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DataSourceCreateManyUserInputEnvelope
    set?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    disconnect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    delete?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    update?: DataSourceUpdateWithWhereUniqueWithoutUserInput | DataSourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DataSourceUpdateManyWithWhereWithoutUserInput | DataSourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DataSourceScalarWhereInput | DataSourceScalarWhereInput[]
  }

  export type DataSourceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DataSourceCreateWithoutUserInput, DataSourceUncheckedCreateWithoutUserInput> | DataSourceCreateWithoutUserInput[] | DataSourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DataSourceCreateOrConnectWithoutUserInput | DataSourceCreateOrConnectWithoutUserInput[]
    upsert?: DataSourceUpsertWithWhereUniqueWithoutUserInput | DataSourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DataSourceCreateManyUserInputEnvelope
    set?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    disconnect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    delete?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    connect?: DataSourceWhereUniqueInput | DataSourceWhereUniqueInput[]
    update?: DataSourceUpdateWithWhereUniqueWithoutUserInput | DataSourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DataSourceUpdateManyWithWhereWithoutUserInput | DataSourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DataSourceScalarWhereInput | DataSourceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutDataSourcesInput = {
    create?: XOR<UserCreateWithoutDataSourcesInput, UserUncheckedCreateWithoutDataSourcesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDataSourcesInput
    connect?: UserWhereUniqueInput
  }

  export type MatchCreateNestedOneWithoutDataSourcesInput = {
    create?: XOR<MatchCreateWithoutDataSourcesInput, MatchUncheckedCreateWithoutDataSourcesInput>
    connectOrCreate?: MatchCreateOrConnectWithoutDataSourcesInput
    connect?: MatchWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutDataSourcesNestedInput = {
    create?: XOR<UserCreateWithoutDataSourcesInput, UserUncheckedCreateWithoutDataSourcesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDataSourcesInput
    upsert?: UserUpsertWithoutDataSourcesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDataSourcesInput, UserUpdateWithoutDataSourcesInput>, UserUncheckedUpdateWithoutDataSourcesInput>
  }

  export type MatchUpdateOneWithoutDataSourcesNestedInput = {
    create?: XOR<MatchCreateWithoutDataSourcesInput, MatchUncheckedCreateWithoutDataSourcesInput>
    connectOrCreate?: MatchCreateOrConnectWithoutDataSourcesInput
    upsert?: MatchUpsertWithoutDataSourcesInput
    disconnect?: MatchWhereInput | boolean
    delete?: MatchWhereInput | boolean
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutDataSourcesInput, MatchUpdateWithoutDataSourcesInput>, MatchUncheckedUpdateWithoutDataSourcesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SentimentCreateWithoutPlayerInput = {
    id?: string
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
    match?: MatchCreateNestedOneWithoutSentimentsInput
  }

  export type SentimentUncheckedCreateWithoutPlayerInput = {
    id?: string
    matchId?: string | null
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
  }

  export type SentimentCreateOrConnectWithoutPlayerInput = {
    where: SentimentWhereUniqueInput
    create: XOR<SentimentCreateWithoutPlayerInput, SentimentUncheckedCreateWithoutPlayerInput>
  }

  export type SentimentCreateManyPlayerInputEnvelope = {
    data: SentimentCreateManyPlayerInput | SentimentCreateManyPlayerInput[]
  }

  export type SentimentUpsertWithWhereUniqueWithoutPlayerInput = {
    where: SentimentWhereUniqueInput
    update: XOR<SentimentUpdateWithoutPlayerInput, SentimentUncheckedUpdateWithoutPlayerInput>
    create: XOR<SentimentCreateWithoutPlayerInput, SentimentUncheckedCreateWithoutPlayerInput>
  }

  export type SentimentUpdateWithWhereUniqueWithoutPlayerInput = {
    where: SentimentWhereUniqueInput
    data: XOR<SentimentUpdateWithoutPlayerInput, SentimentUncheckedUpdateWithoutPlayerInput>
  }

  export type SentimentUpdateManyWithWhereWithoutPlayerInput = {
    where: SentimentScalarWhereInput
    data: XOR<SentimentUpdateManyMutationInput, SentimentUncheckedUpdateManyWithoutPlayerInput>
  }

  export type SentimentScalarWhereInput = {
    AND?: SentimentScalarWhereInput | SentimentScalarWhereInput[]
    OR?: SentimentScalarWhereInput[]
    NOT?: SentimentScalarWhereInput | SentimentScalarWhereInput[]
    id?: StringFilter<"Sentiment"> | string
    playerId?: StringNullableFilter<"Sentiment"> | string | null
    matchId?: StringNullableFilter<"Sentiment"> | string | null
    score?: IntFilter<"Sentiment"> | number
    source?: StringFilter<"Sentiment"> | string
    themes?: StringFilter<"Sentiment"> | string
    breakdown?: StringFilter<"Sentiment"> | string
    timestamp?: DateTimeFilter<"Sentiment"> | Date | string
  }

  export type SentimentCreateWithoutMatchInput = {
    id?: string
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
    player?: PlayerCreateNestedOneWithoutSentimentsInput
  }

  export type SentimentUncheckedCreateWithoutMatchInput = {
    id?: string
    playerId?: string | null
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
  }

  export type SentimentCreateOrConnectWithoutMatchInput = {
    where: SentimentWhereUniqueInput
    create: XOR<SentimentCreateWithoutMatchInput, SentimentUncheckedCreateWithoutMatchInput>
  }

  export type SentimentCreateManyMatchInputEnvelope = {
    data: SentimentCreateManyMatchInput | SentimentCreateManyMatchInput[]
  }

  export type DataSourceCreateWithoutMatchInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    clubId?: string | null
    user?: UserCreateNestedOneWithoutDataSourcesInput
  }

  export type DataSourceUncheckedCreateWithoutMatchInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    userId?: string | null
    clubId?: string | null
  }

  export type DataSourceCreateOrConnectWithoutMatchInput = {
    where: DataSourceWhereUniqueInput
    create: XOR<DataSourceCreateWithoutMatchInput, DataSourceUncheckedCreateWithoutMatchInput>
  }

  export type DataSourceCreateManyMatchInputEnvelope = {
    data: DataSourceCreateManyMatchInput | DataSourceCreateManyMatchInput[]
  }

  export type SentimentUpsertWithWhereUniqueWithoutMatchInput = {
    where: SentimentWhereUniqueInput
    update: XOR<SentimentUpdateWithoutMatchInput, SentimentUncheckedUpdateWithoutMatchInput>
    create: XOR<SentimentCreateWithoutMatchInput, SentimentUncheckedCreateWithoutMatchInput>
  }

  export type SentimentUpdateWithWhereUniqueWithoutMatchInput = {
    where: SentimentWhereUniqueInput
    data: XOR<SentimentUpdateWithoutMatchInput, SentimentUncheckedUpdateWithoutMatchInput>
  }

  export type SentimentUpdateManyWithWhereWithoutMatchInput = {
    where: SentimentScalarWhereInput
    data: XOR<SentimentUpdateManyMutationInput, SentimentUncheckedUpdateManyWithoutMatchInput>
  }

  export type DataSourceUpsertWithWhereUniqueWithoutMatchInput = {
    where: DataSourceWhereUniqueInput
    update: XOR<DataSourceUpdateWithoutMatchInput, DataSourceUncheckedUpdateWithoutMatchInput>
    create: XOR<DataSourceCreateWithoutMatchInput, DataSourceUncheckedCreateWithoutMatchInput>
  }

  export type DataSourceUpdateWithWhereUniqueWithoutMatchInput = {
    where: DataSourceWhereUniqueInput
    data: XOR<DataSourceUpdateWithoutMatchInput, DataSourceUncheckedUpdateWithoutMatchInput>
  }

  export type DataSourceUpdateManyWithWhereWithoutMatchInput = {
    where: DataSourceScalarWhereInput
    data: XOR<DataSourceUpdateManyMutationInput, DataSourceUncheckedUpdateManyWithoutMatchInput>
  }

  export type DataSourceScalarWhereInput = {
    AND?: DataSourceScalarWhereInput | DataSourceScalarWhereInput[]
    OR?: DataSourceScalarWhereInput[]
    NOT?: DataSourceScalarWhereInput | DataSourceScalarWhereInput[]
    id?: StringFilter<"DataSource"> | string
    name?: StringFilter<"DataSource"> | string
    type?: StringFilter<"DataSource"> | string
    url?: StringFilter<"DataSource"> | string
    isActive?: BoolFilter<"DataSource"> | boolean
    lastScraped?: DateTimeFilter<"DataSource"> | Date | string
    userId?: StringNullableFilter<"DataSource"> | string | null
    matchId?: StringNullableFilter<"DataSource"> | string | null
    clubId?: StringNullableFilter<"DataSource"> | string | null
  }

  export type MatchCreateWithoutSentimentsInput = {
    id?: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round?: string | null
    date: Date | string
    aggregateScore?: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON?: string | null
    events?: string | null
    lastUpdated?: Date | string
    dataSources?: DataSourceCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutSentimentsInput = {
    id?: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round?: string | null
    date: Date | string
    aggregateScore?: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON?: string | null
    events?: string | null
    lastUpdated?: Date | string
    dataSources?: DataSourceUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutSentimentsInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutSentimentsInput, MatchUncheckedCreateWithoutSentimentsInput>
  }

  export type PlayerCreateWithoutSentimentsInput = {
    id?: string
    name: string
    team: string
    position: string
    sentiment: number
    tweets: number
    aiConfidence: number
    form: string
    lastUpdated?: Date | string
  }

  export type PlayerUncheckedCreateWithoutSentimentsInput = {
    id?: string
    name: string
    team: string
    position: string
    sentiment: number
    tweets: number
    aiConfidence: number
    form: string
    lastUpdated?: Date | string
  }

  export type PlayerCreateOrConnectWithoutSentimentsInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutSentimentsInput, PlayerUncheckedCreateWithoutSentimentsInput>
  }

  export type MatchUpsertWithoutSentimentsInput = {
    update: XOR<MatchUpdateWithoutSentimentsInput, MatchUncheckedUpdateWithoutSentimentsInput>
    create: XOR<MatchCreateWithoutSentimentsInput, MatchUncheckedCreateWithoutSentimentsInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutSentimentsInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutSentimentsInput, MatchUncheckedUpdateWithoutSentimentsInput>
  }

  export type MatchUpdateWithoutSentimentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSources?: DataSourceUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutSentimentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    dataSources?: DataSourceUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type PlayerUpsertWithoutSentimentsInput = {
    update: XOR<PlayerUpdateWithoutSentimentsInput, PlayerUncheckedUpdateWithoutSentimentsInput>
    create: XOR<PlayerCreateWithoutSentimentsInput, PlayerUncheckedCreateWithoutSentimentsInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutSentimentsInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutSentimentsInput, PlayerUncheckedUpdateWithoutSentimentsInput>
  }

  export type PlayerUpdateWithoutSentimentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    tweets?: IntFieldUpdateOperationsInput | number
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    form?: StringFieldUpdateOperationsInput | string
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerUncheckedUpdateWithoutSentimentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    team?: StringFieldUpdateOperationsInput | string
    position?: StringFieldUpdateOperationsInput | string
    sentiment?: IntFieldUpdateOperationsInput | number
    tweets?: IntFieldUpdateOperationsInput | number
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    form?: StringFieldUpdateOperationsInput | string
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataSourceCreateWithoutUserInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    clubId?: string | null
    match?: MatchCreateNestedOneWithoutDataSourcesInput
  }

  export type DataSourceUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    matchId?: string | null
    clubId?: string | null
  }

  export type DataSourceCreateOrConnectWithoutUserInput = {
    where: DataSourceWhereUniqueInput
    create: XOR<DataSourceCreateWithoutUserInput, DataSourceUncheckedCreateWithoutUserInput>
  }

  export type DataSourceCreateManyUserInputEnvelope = {
    data: DataSourceCreateManyUserInput | DataSourceCreateManyUserInput[]
  }

  export type DataSourceUpsertWithWhereUniqueWithoutUserInput = {
    where: DataSourceWhereUniqueInput
    update: XOR<DataSourceUpdateWithoutUserInput, DataSourceUncheckedUpdateWithoutUserInput>
    create: XOR<DataSourceCreateWithoutUserInput, DataSourceUncheckedCreateWithoutUserInput>
  }

  export type DataSourceUpdateWithWhereUniqueWithoutUserInput = {
    where: DataSourceWhereUniqueInput
    data: XOR<DataSourceUpdateWithoutUserInput, DataSourceUncheckedUpdateWithoutUserInput>
  }

  export type DataSourceUpdateManyWithWhereWithoutUserInput = {
    where: DataSourceScalarWhereInput
    data: XOR<DataSourceUpdateManyMutationInput, DataSourceUncheckedUpdateManyWithoutUserInput>
  }

  export type UserCreateWithoutDataSourcesInput = {
    id?: string
    username: string
    password: string
    role?: string
    assignedTeam?: string | null
    createdAt?: Date | string
  }

  export type UserUncheckedCreateWithoutDataSourcesInput = {
    id?: string
    username: string
    password: string
    role?: string
    assignedTeam?: string | null
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutDataSourcesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDataSourcesInput, UserUncheckedCreateWithoutDataSourcesInput>
  }

  export type MatchCreateWithoutDataSourcesInput = {
    id?: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round?: string | null
    date: Date | string
    aggregateScore?: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON?: string | null
    events?: string | null
    lastUpdated?: Date | string
    sentiments?: SentimentCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutDataSourcesInput = {
    id?: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    status: string
    league: string
    round?: string | null
    date: Date | string
    aggregateScore?: string | null
    homeSentiment: number
    awaySentiment: number
    psycheJSON?: string | null
    events?: string | null
    lastUpdated?: Date | string
    sentiments?: SentimentUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutDataSourcesInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutDataSourcesInput, MatchUncheckedCreateWithoutDataSourcesInput>
  }

  export type UserUpsertWithoutDataSourcesInput = {
    update: XOR<UserUpdateWithoutDataSourcesInput, UserUncheckedUpdateWithoutDataSourcesInput>
    create: XOR<UserCreateWithoutDataSourcesInput, UserUncheckedCreateWithoutDataSourcesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDataSourcesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDataSourcesInput, UserUncheckedUpdateWithoutDataSourcesInput>
  }

  export type UserUpdateWithoutDataSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    assignedTeam?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutDataSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    assignedTeam?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchUpsertWithoutDataSourcesInput = {
    update: XOR<MatchUpdateWithoutDataSourcesInput, MatchUncheckedUpdateWithoutDataSourcesInput>
    create: XOR<MatchCreateWithoutDataSourcesInput, MatchUncheckedCreateWithoutDataSourcesInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutDataSourcesInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutDataSourcesInput, MatchUncheckedUpdateWithoutDataSourcesInput>
  }

  export type MatchUpdateWithoutDataSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    sentiments?: SentimentUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutDataSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    homeTeam?: StringFieldUpdateOperationsInput | string
    awayTeam?: StringFieldUpdateOperationsInput | string
    homeScore?: IntFieldUpdateOperationsInput | number
    awayScore?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    league?: StringFieldUpdateOperationsInput | string
    round?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    aggregateScore?: NullableStringFieldUpdateOperationsInput | string | null
    homeSentiment?: IntFieldUpdateOperationsInput | number
    awaySentiment?: IntFieldUpdateOperationsInput | number
    psycheJSON?: NullableStringFieldUpdateOperationsInput | string | null
    events?: NullableStringFieldUpdateOperationsInput | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    sentiments?: SentimentUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type SentimentCreateManyPlayerInput = {
    id?: string
    matchId?: string | null
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
  }

  export type SentimentUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneWithoutSentimentsNestedInput
  }

  export type SentimentUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentCreateManyMatchInput = {
    id?: string
    playerId?: string | null
    score: number
    source: string
    themes: string
    breakdown: string
    timestamp?: Date | string
  }

  export type DataSourceCreateManyMatchInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    userId?: string | null
    clubId?: string | null
  }

  export type SentimentUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneWithoutSentimentsNestedInput
  }

  export type SentimentUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    themes?: StringFieldUpdateOperationsInput | string
    breakdown?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataSourceUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutDataSourcesNestedInput
  }

  export type DataSourceUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataSourceUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataSourceCreateManyUserInput = {
    id?: string
    name: string
    type: string
    url: string
    isActive?: boolean
    lastScraped?: Date | string
    matchId?: string | null
    clubId?: string | null
  }

  export type DataSourceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
    match?: MatchUpdateOneWithoutDataSourcesNestedInput
  }

  export type DataSourceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DataSourceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastScraped?: DateTimeFieldUpdateOperationsInput | Date | string
    matchId?: NullableStringFieldUpdateOperationsInput | string | null
    clubId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PlayerCountOutputTypeDefaultArgs instead
     */
    export type PlayerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlayerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MatchCountOutputTypeDefaultArgs instead
     */
    export type MatchCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MatchCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlayerDefaultArgs instead
     */
    export type PlayerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlayerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MatchDefaultArgs instead
     */
    export type MatchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MatchDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SentimentDefaultArgs instead
     */
    export type SentimentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SentimentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DataSourceDefaultArgs instead
     */
    export type DataSourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DataSourceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TweetDefaultArgs instead
     */
    export type TweetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TweetDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}