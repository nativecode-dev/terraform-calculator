import 'mocha'

import toJsonSchema from 'to-json-schema'

import expect from './expect'

import { fs } from '@nofrills/fs'
import { TERRAFORM_ROOT } from './dirs'
import { Terraform } from '../src/Terraform'

describe('when using terraform', () => {
  const sut = new Terraform(TERRAFORM_ROOT)
  const name = 'dev'

  it('should initialize terraform modules', () => {
    expect(sut.initialize()).is.eventually.not.empty
  })

  describe('after project initialized', () => {
    it('should create plan file', async () => {
      const plan = await sut.plan()
      expect(fs.exists(plan[0])).to.eventually.be.true
    })

    describe('working with plans', () => {
      it('should show plan json', async () => {
        const json = await sut.show()
        const schema = toJsonSchema(JSON.parse(json))
        console.log(schema)
      })
    })

    describe('working with workspaces', () => {
      it('should create workspace', async () => {
        const workspace = await sut.createWorkspace(name)
        expect(workspace).to.includes(`Created and switched to workspace "${name}"!`)
      })

      it('should get workspaces', async () => {
        const workspaces = await sut.workspaces()
        expect(workspaces).to.deep.equal(['default', name])
      })

      it('should select workspace', async () => {
        const workspace = await sut.workspace('default')
        expect(workspace).to.deep.equal(['Switched to workspace "default".'])
      })

      it('should delete workspace', async () => {
        const workspace = await sut.deleteWorkspace(name)
        expect(workspace).to.be.deep.equal([`Deleted workspace "${name}"!`])
      })
    })
  })
})
