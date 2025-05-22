import { ref } from 'vue'
import { useFlags } from '../src'
import flagsmith, { IFlags, IFlagsmithFeature, ITraits } from 'flagsmith'
import { expectTypeOf } from 'expect-type'

// test: should not set a specific flag value type when flag is a string
const { is_visible: isVisibleFeatureNonSpecific, is_test: isTestFeatureNonSpecific } = useFlags(
    ['is_visible', 'is_test'],
    {
        flags: ref<IFlags>(),
        traits: ref<ITraits>(),
        loadingState: ref(),
        flagsmithInstance: flagsmith,
    }
)

expectTypeOf(isVisibleFeatureNonSpecific?.value?.value).toEqualTypeOf<
    IFlagsmithFeature['value'] | undefined
>()
expectTypeOf(isTestFeatureNonSpecific?.value?.value).toEqualTypeOf<
    IFlagsmithFeature['value'] | undefined
>()

// test: should set the flag value type to the flag interface value type when flag is an interface
const { is_visible: isVisibleFeatureBoolean, is_test: isTestFeatureString } = useFlags<{
    is_visible: boolean
    is_test: string
}>(['is_visible', 'is_test'], {
    flags: ref<IFlags>(),
    traits: ref<ITraits>(),
    loadingState: ref(),
    flagsmithInstance: flagsmith,
})

expectTypeOf(isVisibleFeatureBoolean.value?.value).toEqualTypeOf<boolean | undefined>()
expectTypeOf(isTestFeatureString.value?.value).toEqualTypeOf<string | undefined>()
