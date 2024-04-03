import { defineComponent } from 'vue'
import { useFlagsmith } from '../src/index'
import { mount } from '@vue/test-utils'

jest.mock('flagsmith')

const ChildComponent = defineComponent({
    template: '<div></div>',
})

const ParentComponent = defineComponent({
    template: '<main><child-component /></main>',
    components: { ChildComponent },
    setup() {
        useFlagsmith({
            environmentID: '',
        })
    },
})

const mountParentComponent = () => mount(ParentComponent)

describe('flagsmith-vue', () => {
    describe('Flags', () => {
        mountParentComponent()
        test.todo('should have feature flags')
    })

    describe('Traits', () => {
        test.todo('should have traits')
    })

    describe('Loading status', () => {
        test.todo('should have current loading status')
    })
})
