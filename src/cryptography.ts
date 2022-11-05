import { getPublicKey, utils } from 'ethereum-cryptography/secp256k1'
import { ecdsaRecover, ecdsaSign } from 'ethereum-cryptography/secp256k1-compat'
import { keccak256 as _keccak256 } from 'ethereum-cryptography/keccak'
import { randomBytes } from 'crypto'
import EthCrypto from 'eth-crypto'

const ID_LENGTH = 8

interface Signature {
  signature: Uint8Array
  recid: number
}

export function genPrivateKey(): Buffer {
  const privateKey = utils.randomPrivateKey()
  return utils.isValidPrivateKey(privateKey)
    ? Buffer.from(privateKey)
    : genPrivateKey()
}

export function privateKey2publicKey(privateKey: Buffer): Buffer {
  return Buffer.from(getPublicKey(privateKey, false)).slice(1)
}

export function publicKey2id(publicKey: Buffer): Buffer {
  const address = publicKey2address(publicKey)
  return keccak256(keccak256(address)).slice(-ID_LENGTH)
}

export function randomId(): Buffer {
  return randomBytes(ID_LENGTH)
}

export function publicKey2address(publicKey: Buffer): Buffer {
  return keccak256(publicKey).slice(-20)
}

export function hexString2buffer(hex: string): Buffer {
  let t = hex
  if (hex.startsWith('0x')) t = hex.slice(2)
  return Buffer.from(t, 'hex')
}

export function buffer2HexString(buf: Buffer, sign: boolean = false): string {
  return (sign ? '0x' : '') + Buffer.from(buf).toString('hex')
}

export function keccak256(...buffers: Buffer[]): Buffer {
  const buffer = Buffer.concat(buffers)
  return Buffer.from(_keccak256(buffer))
}

export function sign(msgHash: Buffer, privateKey: Buffer): Signature {
  return ecdsaSign(msgHash, privateKey)
}

export function recover(
  signature: Buffer,
  recoverId: number,
  msgHash: Buffer
): Buffer {
  return Buffer.from(ecdsaRecover(signature, recoverId, msgHash, false)).slice(
    1
  )
}

export interface EncryptPayload {
  message: string
  signature: string
  recid: number
}
export async function encrypt(
  message: Buffer,
  encryptPublicKey: Buffer,
  signPrivateKey: Buffer
): Promise<Buffer> {
  const signature = sign(keccak256(message), signPrivateKey)
  const payload: EncryptPayload = {
    message: buffer2HexString(message),
    signature: buffer2HexString(signature.signature as Buffer),
    recid: signature.recid,
  }
  const encrypted = await EthCrypto.encryptWithPublicKey(
    buffer2HexString(encryptPublicKey),
    JSON.stringify(payload)
  )
  return hexString2buffer(EthCrypto.cipher.stringify(encrypted))
}

export async function decrypt(
  data: Buffer,
  decryptPrivateKey: Buffer,
  signPublicKey: Buffer
): Promise<Buffer> {
  const encryptedObject = EthCrypto.cipher.parse(buffer2HexString(data))
  const decrypted = await EthCrypto.decryptWithPrivateKey(
    buffer2HexString(decryptPrivateKey),
    encryptedObject
  )
  const payload = JSON.parse(decrypted) as EncryptPayload
  const message = hexString2buffer(payload.message)
  const publicKey = Buffer.from(
    recover(
      hexString2buffer(payload.signature),
      payload.recid,
      keccak256(message)
    )
  )
  if (buffer2HexString(signPublicKey) !== buffer2HexString(publicKey)) {
    throw new Error('signature check failed')
  }
  return message
}

export { ecdsaRecover, ecdsaSign, randomBytes }
