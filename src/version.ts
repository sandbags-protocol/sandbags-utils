import semver from 'semver'

export class SandbagsVersionError extends Error {}
export class SandbagsVersionNotValidError extends SandbagsVersionError {
  constructor(version: string) {
    super(`version ${version} not valid`)
  }
}
export class SandbagsVersionRangeNotValidError extends SandbagsVersionError {
  constructor(range: string) {
    super(`range ${range} not valid`)
  }
}

export default class SandbagsVersion {
  constructor(private readonly version: string) {}

  toString(): string {
    return this.version
  }

  get isValid(): boolean {
    return semver.valid(this.version) === this.version
  }

  static checkValid(...versions: SandbagsVersion[]): void {
    for (let i = 0; i < versions.length; i++) {
      const version = versions[i]
      if (!version.isValid) {
        throw new SandbagsVersionNotValidError(version.toString())
      }
    }
  }

  static checkRangeValid(...ranges: string[]): void {
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i]
      if (!semver.validRange(range)) {
        throw new SandbagsVersionRangeNotValidError(range.toString())
      }
    }
  }

  cmp(comparator: semver.Operator, other: SandbagsVersion): boolean {
    SandbagsVersion.checkValid(this, other)
    return semver.cmp(this.version, comparator, other.toString())
  }

  gt(other: SandbagsVersion): boolean {
    return this.cmp('>', other)
  }

  gte(other: SandbagsVersion): boolean {
    return this.cmp('>=', other)
  }

  lt(other: SandbagsVersion): boolean {
    return this.cmp('<', other)
  }

  lte(other: SandbagsVersion): boolean {
    return this.cmp('<=', other)
  }

  eq(other: SandbagsVersion): boolean {
    return this.cmp('=', other)
  }

  satisfies(range: string): boolean {
    SandbagsVersion.checkValid(this)
    SandbagsVersion.checkRangeValid(range)
    return semver.satisfies(this.version, range)
  }
}
