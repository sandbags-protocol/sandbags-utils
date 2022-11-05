import { Writable } from 'stream'

export enum SandbagsLogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

export const SandbagsLogLevelMap = [
  'TRACE',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
  'FATAL',
]

let outputLevel: SandbagsLogLevel = SandbagsLogLevel.TRACE

export function setOutputLevel(level: SandbagsLogLevel): void {
  outputLevel = level
}

function defaultOutputHandler(message: string): void {
  console.log(message)
}

let outputHandler: (message: string) => void = defaultOutputHandler

export function setOutputHandler(handler: (message: string) => void): void {
  outputHandler = handler
}

export interface SandbagsLogData {
  level: string
  topic: string
  message?: string
  [key: string]: any
}

function output(
  level: SandbagsLogLevel,
  topic: string,
  message: string | Object
): void {
  if (level < outputLevel) return
  let data: SandbagsLogData = {
    level: SandbagsLogLevelMap[level],
    topic,
  }
  if (typeof message === 'string') {
    data.message = message
  } else {
    data = {
      ...data,
      ...message,
    }
  }
  outputHandler(JSON.stringify(data))
}

export interface SandbagsLogger {
  trace: (message: string | Object) => void
  debug: (message: string | Object) => void
  info: (message: string | Object) => void
  warn: (message: string | Object) => void
  error: (message: string | Object) => void
  fatal: (message: string | Object) => void
  stream: SandbagsLogStream
}

export class SandbagsLogStream extends Writable {
  level: SandbagsLogLevel = SandbagsLogLevel.INFO

  constructor(private readonly topic: string) {
    super({
      write: (chunk, encoding, callback): void => {
        const message = (chunk.toString() as string).trim()
        output(this.level, this.topic, message)
      },
    })
    // this.on('pipe', (message) => {
    //   console.log('pipe', message)
    // })
  }
}

export default function logger(topic: string): SandbagsLogger {
  const log = {
    trace(message: string | Object) {
      output(SandbagsLogLevel.TRACE, topic, message)
    },
    debug(message: string | Object) {
      output(SandbagsLogLevel.DEBUG, topic, message)
    },
    info(message: string | Object) {
      output(SandbagsLogLevel.INFO, topic, message)
    },
    warn(message: string | Object) {
      output(SandbagsLogLevel.WARN, topic, message)
    },
    error(message: string | Object) {
      output(SandbagsLogLevel.ERROR, topic, message)
    },
    fatal(message: string | Object) {
      output(SandbagsLogLevel.FATAL, topic, message)
    },
    stream: new SandbagsLogStream(topic),
  }
  return log
}
