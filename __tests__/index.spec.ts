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
        <div v-if="error"
            class="child-component--error">
        </div>
        <div v-if="isFetching"
            class="child-component--fetching">
        </div>
        <div v-if="isLoading"
            class="child-component--loading">
            Source: {{ source }}
        </div>
    </div>`,
    setup() {
        const { is_visible: isVisibleFeature } = useFlags(['is_visible'])
        const isVisible = computed(() => isVisibleFeature.value?.value)
        const { test_trait: testTrait } = useTraits(['test_trait'])
        const { error, isFetching, isLoading, source } = useFlagsmithLoading()

        return {
            isVisible,
            testTrait,
            error,
            isFetching,
            isLoading,
            source,
        }
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
        const originalLoadingState = flagsmith.loadingState!
        beforeEach(() => {
            flagsmith.loadingState = { ...originalLoadingState }
        })

        describe('error', () => {
            it('should display the error element when there is a flagsmith error', async () => {
                flagsmith.loadingState!.error = new Error('Test error')
                const wrapper = mountParentComponent()

                flagsmith._triggerLoadingState!()
                await nextTick()

                expect(() => wrapper.get('.child-component--error')).not.toThrow()
            })

            it('should not display the error element when there is no flagsmith error', async () => {
                const wrapper = mountParentComponent()

                flagsmith._triggerLoadingState!()
                await nextTick()

                expect(() => wrapper.get('.child-component--error')).toThrow()
            })
        })

        describe('isFetching', () => {
            it('should display the fetching element when flagsmith is fetching', async () => {
                flagsmith.loadingState!.isFetching = true
                const wrapper = mountParentComponent()

                flagsmith._triggerLoadingState!()
                await nextTick()

                expect(() => wrapper.get('.child-component--fetching')).not.toThrow()
            })

            it('should not display the fetching element when flagsmith is not fetching', async () => {
                flagsmith.loadingState!.isFetching = false
                const wrapper = mountParentComponent()

                flagsmith._triggerLoadingState!()
                await nextTick()

                expect(() => wrapper.get('.child-component--fetching')).toThrow()
            })
        })

        describe('isLoading', () => {
            it('should display the loading element when flagsmith is loading', async () => {
                flagsmith.loadingState!.isLoading = true
                const wrapper = mountParentComponent()

                flagsmith._triggerLoadingState!()
                await nextTick()

                expect(() => wrapper.get('.child-component--loading')).not.toThrow()
            })

            it('should not display the loading element when flagsmith is not loading', async () => {
                flagsmith.loadingState!.isLoading = false
                const wrapper = mountParentComponent()

                flagsmith._triggerLoadingState!()
                await nextTick()

                expect(() => wrapper.get('.child-component--loading')).toThrow()
            })
        })

        describe('Loading source', () => {
            it('should display the loading source when flagsmith is loading', async () => {
                flagsmith.loadingState!.isLoading = true
                const wrapper = mountParentComponent()

                flagsmith._triggerLoadingState!()
                await nextTick()

                const loadingElement = wrapper.get('.child-component--loading')
                expect(loadingElement.text().trim()).toBe(
                    `Source: ${flagsmith.loadingState!.source}`
                )
            })
        })
    })

    describe('Provide and inject helper', () => {
        it('should throw error when trying to inject in the same component', () => {
            const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation()
            const errorComponent = defineComponent({
                template: '<div />',
                setup() {
                    useFlagsmith({
                        environmentID: '',
                    })
                    useFlags(['test_flag'])
                },
            })
            expect(() => mount(errorComponent)).toThrow()
            consoleWarnMock.mockRestore()
        })

        it('should not throw error when trying to inject in the same component and helper is provided', () => {
            const correctComponent = defineComponent({
                template: '<div />',
                setup() {
                    const helper = useFlagsmith({
                        environmentID: '',
                    })
                    useFlags(['test_flag'], helper)
                },
            })
            expect(() => mount(correctComponent)).not.toThrow()
        })
    })
})
