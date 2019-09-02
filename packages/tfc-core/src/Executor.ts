import execa from 'execa'

import os from 'os'

import { Is } from '@nofrills/types'

export class Executor {
  constructor(
    private readonly cwd: string,
    private readonly stderr: NodeJS.WriteStream = process.stderr,
    private readonly stdin: NodeJS.ReadStream = process.stdin,
    private readonly stdout: NodeJS.WriteStream = process.stdout,
  ) {}

  async console(command: string, ...args: string[]): Promise<number> {
    const options: execa.Options = {
      cwd: this.cwd,
      stderr: this.stderr,
      stdin: this.stdin,
      stdout: this.stdout,
    }

    const result = await execa(command, args, options)

    return result.exitCode
  }

  async text(command: string, ...args: string[]): Promise<string[]> {
    const options: execa.Options = {
      cwd: this.cwd,
    }

    const result = await execa(command, args, options)

    if (result.stderr) {
      return this.sanitize(result.stderr)
    }

    if (result.stdout) {
      return this.sanitize(result.stdout)
    }

    return []
  }

  private sanitize(value: string | string[]): string[] {
    const lines: string[] = Is.array(value) ? (value as string[]) : [String(value)]
    return lines.reduce<string[]>((previous, current) => previous.concat(current.split(os.EOL)), [])
  }
}
