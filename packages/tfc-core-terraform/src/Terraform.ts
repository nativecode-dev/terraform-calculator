import toJsonSchema from 'to-json-schema'

import { fs } from '@nofrills/fs'
import { Executor } from '@nativecode/tfc-core'

export class Terraform {
  private readonly executor: Executor

  private readonly planfile: string = fs.join(this.cwd, `.terraform/terraform-${process.pid}.tfplan`)

  constructor(private readonly cwd: string = process.cwd(), private readonly exepath: string = 'terraform') {
    this.executor = new Executor(cwd)
  }

  /**
   * Applies Terraform plan.
   */
  async apply(autoplan: boolean = false): Promise<string[]> {
    if (autoplan && (await fs.exists(this.planfile)) === false) {
      await this.plan()
    }
    return this.clean(this.executor.text(this.exepath, 'apply', this.planfile))
  }

  /**
   * Creates a new workspace.
   * @param name workspace name
   */
  createWorkspace(name: string): Promise<string[]> {
    return this.clean(this.executor.text(this.exepath, 'workspace', 'new', name))
  }

  /**
   * Delete an existing workspace.
   * @param name workspace name
   */
  deleteWorkspace(name: string): Promise<string[]> {
    return this.clean(this.executor.text(this.exepath, 'workspace', 'delete', name))
  }

  /**
   * Initialize Terraform modules.
   */
  initialize(): Promise<string[]> {
    return this.clean(this.executor.text(this.exepath, 'init'))
  }

  /**
   * Creates execution plan file.
   */
  async plan(): Promise<string> {
    await this.executor.text(this.exepath, 'plan', `-out=${this.planfile}`)

    if (await fs.exists(this.planfile)) {
      return this.planfile
    }

    throw new Error(`unable to write plan file: ${this.planfile}`)
  }

  /**
   * Creates a schema from a plan JSON file.
   * @param value json instance
   */
  schema(value: any): Promise<any> {
    return Promise.resolve(toJsonSchema(value))
  }

  /**
   * Shows the currnet plan file as json.
   */
  async show(): Promise<any> {
    if ((await fs.exists(this.planfile)) === false) {
      await this.plan()
    }

    const results = await this.clean(this.executor.text(this.exepath, 'show', '-json', '-no-color', this.planfile))
    return JSON.parse(results.join())
  }

  /**
   * Switches workspaces.
   * @param name workspace name
   */
  workspace(name: string): Promise<string[]> {
    if (name === 'current') {
      return this.clean(this.executor.text(this.exepath, 'workspace', 'show'))
    }
    return this.clean(this.executor.text(this.exepath, 'workspace', 'select', name))
  }

  /**
   * Returns a list of workspace names.
   */
  async workspaces(): Promise<string[]> {
    const results = await this.clean(this.executor.text(this.exepath, 'workspace', 'list'))
    return results.map(result => result.replace('* ', ''))
  }

  /**
   * Returns list of versions.
   */
  version(): Promise<string[]> {
    return this.clean(this.executor.text(this.exepath, 'version'))
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
