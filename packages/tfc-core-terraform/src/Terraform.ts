import { fs } from '@nofrills/fs'
import { Executor } from '@nativecode/tfc-core'

export class Terraform {
  private readonly executor: Executor

  private readonly planfile: string = fs.join(this.cwd, `terraform-${process.pid}.tfplan`)

  constructor(private readonly cwd: string = process.cwd(), private readonly path: string = 'terraform') {
    this.executor = new Executor(cwd)
  }

  createWorkspace(name: string): Promise<string[]> {
    return this.clean(this.executor.text(this.path, 'workspace', 'new', name))
  }

  deleteWorkspace(name: string): Promise<string[]> {
    return this.clean(this.executor.text(this.path, 'workspace', 'delete', name))
  }

  initialize(): Promise<string[]> {
    return this.clean(this.executor.text(this.path, 'init'))
  }

  plan(): Promise<string[]> {
    return this.clean(this.executor.text(this.path, 'plan', `-out=${this.planfile}`), this.planfile)
  }

  async show(): Promise<string> {
    if (await fs.exists(this.planfile)) {
      const json = await this.clean(this.executor.text(this.path, 'show', '-json', '-no-color', this.planfile))
      return json.join()
    }

    return JSON.stringify({})
  }

  workspace(name: string): Promise<string[]> {
    return this.clean(this.executor.text(this.path, 'workspace', 'select', name))
  }

  async workspaces(): Promise<string[]> {
    const results = await this.clean(this.executor.text(this.path, 'workspace', 'list'))
    return results.map(result => result.replace('* ', ''))
  }

  private async clean(task: Promise<string[]>, ...args: string[]) {
    const lines = await task

    const removeColors = (text: string): string => text.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '')

    const removeUnicode = (text: string): string =>
      text.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')

    return args.concat(
      lines
        .map(removeColors)
        .map(removeUnicode)
        .map(line => line.trim())
        .filter(line => line && line.length > 0),
    )
  }
}
