import 'mocha'

import expect from './expect'

import { Executor } from '../src/Executor'

describe('when using executor', () => {
  const sut = new Executor(process.cwd())

  describe('to run "which" command', () => {
    it('should return executable path', async () => {
      const lines = await sut.text('which', 'terraform')
      expect(lines).is.not.empty
    })
  })
})
