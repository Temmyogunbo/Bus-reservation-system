import { interfaceType } from '@nexus/schema'

export const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.int('id', { description: 'Unique identifier for the resource' })
    t.resolveType(() => null)
  },
})
