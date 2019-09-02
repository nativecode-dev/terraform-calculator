import { Executor } from '@nativecode/tfc-core'

export class Terraform {
  private readonly executor: Executor

  constructor(private readonly cwd: string = process.cwd(), private readonly path: string = 'terraform') {
    this.executor = new Executor(cwd)
  }

  async createWorkspace(name: string) {
    return this.clean(this.executor.text(this.path, 'workspace', 'new', name))
  }

  async deleteWorkspace(name: string) {
    return this.clean(this.executor.text(this.path, 'workspace', 'delete', name))
  }

  async initialize() {
    return this.clean(this.executor.text(this.path, 'init'))
  }

  async workspace(name: string) {
    return this.clean(this.executor.text(this.path, 'workspace', 'select', name))
  }

  async workspaces() {
    return this.clean(this.executor.text(this.path, 'workspace', 'list'))
  }

  private async clean(task: Promise<string[]>) {
    const lines = await task
    const decolorize = (text: string): string => text.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '')

    const deunicode = (text: string): string =>
      text.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')

    return lines
      .map(decolorize)
      .map(deunicode)
      .map(line => line.trim())
      .filter(line => line && line.length > 0)
  }
}
