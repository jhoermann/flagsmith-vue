import { computed, defineComponent, nextTick } from 'vue'
import { useFlags, useFlagsmith, useFlagsmithLoading, useTraits } from '../src/index'
import { mount } from '@vue/test-utils'
import flagsmith from 'flagsmith'
import type { IFlagsmithFeature } from 'flagsmith/types'

jest.mock('flagsmith')

const ChildComponent = defineComponent({
    template: `
    <div class="child-component"
        :test-trait="testTrait">
        <div v-if="isVisible"
            class="child-component--feature">
        </div>
        <div v-if="isLoading"
            class="child-component--loading">
        </div>
    </div>`,
    setup() {
        const { is_visible: isVisibleFeature } = useFlags(['is_visible'])
        const isVisible = computed(() => isVisibleFeature.value?.value)
        const { test_trait: testTrait } = useTraits(['test_trait'])
        const { isLoading } = useFlagsmithLoading()

        return { isVisible, testTrait, isLoading }
    },
})

const isVisibleFeatureMock: IFlagsmithFeature = {
    id: 1,
    enabled: true,
    value: true,
}

const ParentComponent = defineComponent({
    template: `<main><child-component /></main>`,
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

            expect(() => wrapper.get('.child-component--feature')).not.toThrow()
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

            expect(() => wrapper.get('.child-component--feature')).toThrow()
        })
    })

    describe('Traits', () => {
        it('should display the trait attribute when the trait is set', async () => {
            jest.mocked(flagsmith.getAllTraits).mockImplementation(() => ({
                test_trait: 'test-trait',
            }))
            const wrapper = mountParentComponent()

            flagsmith._trigger!()
            await nextTick()

            expect(wrapper.get('.child-component').attributes('test-trait')).toBe('test-trait')
        })

        it('should not display the trait attribute when the trait is not set', async () => {
            jest.mocked(flagsmith.getAllTraits).mockImplementation(() => ({}))
            const wrapper = mountParentComponent()

            flagsmith._trigger!()
            await nextTick()

            expect(wrapper.get('.child-component').attributes('test-trait')).toBeUndefined()
        })
    })

    describe('Loading status', () => {
        it('should display the loading element when flagsmith is loading', async () => {
            jest.mocked(flagsmith.loadingState!).isLoading = true
            const wrapper = mountParentComponent()

            flagsmith._triggerLoadingState!()
            await nextTick()

            expect(() => wrapper.get('.child-component--loading')).not.toThrow()
        })

        it('should not display the loading element when flagsmith is not loading', async () => {
            jest.mocked(flagsmith.loadingState!).isLoading = false
            const wrapper = mountParentComponent()

            flagsmith._triggerLoadingState!()
            await nextTick()

            expect(() => wrapper.get('.child-component--loading')).toThrow()
        })
    })
})
