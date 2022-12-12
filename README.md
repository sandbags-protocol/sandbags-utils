# Sandbags Utils

[![npm version][1]][2] [![license][3]][4] [![Types][5]][6]

This project is a collection of common functions/features used in developing applications and tools for Sandbags Protocol.

## Usage

Use NPM / Yarn in node.js:

```
# NPM
npm i @sandbags-protocol/sandbags-utils

# Yarn
yarn add @sandbags-protocol/sandbags-utils
```

## Cryptography

```typescript
import {
  ecdsaRecover,
  ecdsaSign,
  randomBytes,
  genPrivateKey,
  privateKey2publicKey,
  publicKey2id,
  randomId,
  publicKey2address,
  hexString2buffer,
  buffer2HexString,
  keccak256,
  sign,
  recover,
  encrypt,
  decrypt,
} from '@sandbags-protocol/sandbags-utils/lib/cryptography'
```

### ecdsaRecover, ecdsaSign

Imported from `ethereum-cryptography/secp256k1-compat`, see [API of secp256k1-node](https://github.com/cryptocoinjs/secp256k1-node/blob/master/API.md).

### randomBytes

Imported from `crypto`, see [nodejs document](https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#cryptorandombytessize-callback).

### genPrivateKey

```typescript
function genPrivateKey(): Buffer
```

Generate an ethereum private key.

### privateKey2publicKey

```typescript
function privateKey2publicKey(privateKey: Buffer): Buffer
```

Convert a private key to public key.


### publicKey2address

```typescript
function publicKey2address(publicKey: Buffer): Buffer
```

Convert a public key to wallet address.

### publicKey2id

```typescript
function publicKey2id(publicKey: Buffer): Buffer
```

Convert a public key to sandbags node id.

### randomId

```typescript
function randomId(): Buffer
```

Generate an random sandbags node id.

### hexString2buffer, buffer2HexString

```typescript
function hexString2buffer(hex: string): Buffer
function buffer2HexString(buf: Buffer, sign?: boolean): string
```

Convert hex string to buffer, ether it starts with `0x` or not.

Convert buffer to hex string, if `sign` passed as `true`, return hex string with `0x` prefix.

### keccak256

```typescript
function keccak256(...buffers: Buffer[]): Buffer
```

Concat all input buffers and do `keccak256` hash.

### sign, recover

```typescript
interface Signature {
  signature: Uint8Array;
  recid: number;
}
function sign(msgHash: Buffer, privateKey: Buffer): Signature
function recover(signature: Buffer, recoverId: number, msgHash: Buffer): Buffer
```

Sign and recover a buffer message.

### encrypt, decrypt

```typescript
function encrypt(message: Buffer, encryptPublicKey: Buffer, signPrivateKey: Buffer): Promise<Buffer>
function decrypt(data: Buffer, decryptPrivateKey: Buffer, signPublicKey: Buffer): Promise<Buffer>
```

Encrypt and decrypt message between 2 public/private key pairs.

## Logger

```typescript
import {
  SandbagsLogLevel,
  setOutputLevel,
  setOutputHandler,
} from '@sandbags-protocol/sandbags-utils/lib/logger'
import sandbagsLogger from '@sandbags-protocol/sandbags-utils/lib/logger'

const logger = sandbagsLogger('topic')
logger.trace('trace message')
// {"level":"TRACE","topic":"topic","message":"trace message"}
logger.debug('debug message')
// {"level":"DEBUG","topic":"topic","message":"debug message"}
logger.info('info message')
// {"level":"INFO","topic":"topic","message":"info message"}
logger.warn('warn message')
// {"level":"WARN","topic":"topic","message":"warn message"}
logger.error('error message')
// {"level":"ERROR","topic":"topic","message":"error message"}
logger.fatal('fatal message')
// {"level":"FATAL","topic":"topic","message":"fatal message"}

setOutputLevel(SandbagsLogLevel.WARN)
// will only log WARN, ERROR and FATAL event.

setOutputHandler((eventString: string): void => {
  const event = JSON.parse(eventString)
  console.log(`[${event.topic}][${event.level}] ${event.message}`)
})

logger.fatal('fatal message')
// [topic][FATAL] fatal message

// stream usage
someOtherLogReporter.outputStream = logger.stream.copy()
someOtherLogReporter.outputStream.level = SandbagsLogLevel.INFO
```

## Version

```typescript
import SandbagsVersion from '@sandbags-protocol/sandbags-utils/lib/version'

const version0 = new SandbagsVersion('x.x.x')
const version1 = new SandbagsVersion('0.1.0')
const version2 = new SandbagsVersion('0.2.0')

version0.toString()
// 'x.x.x'
version0.isValid
// false
version1.isValid
// true
version1.gt(version2)
// false
version1.gte(version2)
// false
version1.lt(version2)
// true
version1.lte(version2)
// true
version1.eq(version2)
// false
version1.satisfies('0.0.1 - 0.3.0')
// true
```

## License

`@sandbags-protocol/sandbags-utils` is released under The GNU GENERAL PUBLIC LICENSE version 3 (GPL-3.0)

See [LICENSE](./LICENSE) file.

[1]: https://img.shields.io/npm/v/@sandbags-protocol/sandbags-utils.svg
[2]: https://www.npmjs.com/package/@sandbags-protocol/sandbags-utils

[3]: https://img.shields.io/npm/l/@sandbags-protocol/sandbags-utils
[4]: https://github.com/sandbags-protocol/sandbags-utils/blob/main/LICENSE

[5]: https://img.shields.io/npm/types/@sandbags-protocol/sandbags-utils.svg
[6]: https://www.npmjs.com/package/@sandbags-protocol/sandbags-utils
