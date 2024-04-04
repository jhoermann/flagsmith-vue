import { computed, defineComponent, nextTick } from 'vue'
import { useFlags, useFlagsmith } from '../src/index'
import { mount } from '@vue/test-utils'
import flagsmith from 'flagsmith'

jest.mock('flagsmith')

const ChildComponent = defineComponent({
    template: '<div v-if="isVisible" class="child-component"></div>',
    setup() {
        const { is_visible: isVisibleFeature } = useFlags(['is_visible'])
        const isVisible = computed(() => isVisibleFeature.value?.value)

        return { isVisible }
    },
})

const isVisibleFeatureMock = {
    id: 1,
    enabled: true,
    value: true,
}

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
        it('should show the child component when feature flag is set to true', async () => {
            jest.mocked(flagsmith.getAllFlags).mockImplementation(() => ({
                is_visible: isVisibleFeatureMock,
            }))
            const wrapper = mountParentComponent()

            flagsmith._trigger!()
            await nextTick()

            expect(() => wrapper.get('.child-component')).not.toThrow()
        })

        it('should not show the child component when feature flag is set false', async () => {
            jest.mocked(flagsmith.getAllFlags).mockImplementation(() => ({
                is_visible: {
                    ...isVisibleFeatureMock,
                    value: false,
                },
            }))
            const wrapper = mountParentComponent()

            flagsmith._trigger!()
            await nextTick()

            expect(() => wrapper.get('.child-component')).toThrow()
        })
    })

    describe('Traits', () => {
        test.todo('should have traits')
    })

    describe('Loading status', () => {
        test.todo('should have current loading status')
    })
})
