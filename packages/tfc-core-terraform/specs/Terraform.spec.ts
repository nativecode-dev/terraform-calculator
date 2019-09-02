import 'mocha'

import expect from './expect'

import { TERRAFORM_ROOT } from './dirs'
import { Terraform } from '../src/Terraform'

describe('when using terraform', () => {
  const sut = new Terraform(TERRAFORM_ROOT)
  const name = 'dev'

  it('should initialize terraform modules', async () => {
    const output = await sut.initialize()
    expect(output).is.not.empty
  })

  describe('after project initialized', () => {
    it('should create workspace', async () => {
      const workspace = await sut.createWorkspace(name)
      console.log('create', workspace)
      expect(workspace).to.not.be.empty
    })

    it('should get workspaces', async () => {
      const workspaces = await sut.workspaces()
      console.log('list', workspaces)
      expect(workspaces).to.not.be.empty
    })

    it('should select workspace', async () => {
      const workspace = await sut.workspace(name)
      console.log('select', workspace)
      expect(workspace).to.be.empty
    })

    it('should delete workspace', async () => {
      const workspace = await sut.deleteWorkspace(name)
      console.log('delete', workspace)
      expect(workspace).to.not.be.empty
    })
  })
})
