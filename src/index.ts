import flagsmith from 'flagsmith'
import type {
    IFlags,
    IFlagsmithFeature,
    IFlagsmithTrait,
    IInitConfig,
    ITraits,
    LoadingState,
    FlagSource,
} from 'flagsmith/types'
import { computed, inject, provide, ref } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

interface FlagsmithHelper<F extends string = string, T extends string = string> {
    flags: Ref<IFlags<F> | undefined>
    traits: Ref<ITraits<T> | undefined>
    loadingState: Ref<LoadingState | undefined>
}

const FlagsmithInjectionKey: InjectionKey<FlagsmithHelper> = Symbol('FlagsmithInjectionKey')
const injectHelper = (): FlagsmithHelper => {
    const helper = inject(FlagsmithInjectionKey)

    if (helper === undefined) {
        throw new TypeError(`Flagsmith vue: Injected helper should not be undefined.`)
    }

    return helper
}

export const useFlagsmith = <F extends string = string, T extends string = string>(
    options: IInitConfig<F, T>,
    flagsmithInstance = flagsmith
): void => {
    const flags = ref<IFlags>()
    const traits = ref<ITraits>()
    const loadingState = ref<LoadingState>()

    void flagsmithInstance.init(options)
    flagsmithInstance._trigger = () => {
        flags.value = flagsmithInstance.getAllFlags()
        traits.value = flagsmithInstance.getAllTraits()
    }
    flagsmithInstance._triggerLoadingState = () => {
        loadingState.value = flagsmithInstance.loadingState
    }

    const helper: FlagsmithHelper = {
        flags,
        traits,
        loadingState,
    }
    provide(FlagsmithInjectionKey, helper)
}

type ComputedObject<Key extends string, ComputedValue> = {
    [K in Key]: ComputedRef<ComputedValue>
}

export const useFlags = <F extends string = string>(
    flagsToUse: F[]
): ComputedObject<F, IFlagsmithFeature | undefined> => {
    const { flags } = injectHelper()
    return Object.fromEntries(
        flagsToUse.map((flag) => [flag, computed(() => flags.value?.[flag])])
    ) as ComputedObject<F, IFlagsmithFeature | undefined>
}

export const useTraits = <T extends string = string>(
    traitsToUse: T[]
): ComputedObject<T, IFlagsmithTrait | undefined> => {
    const { traits } = injectHelper()
    return Object.fromEntries(
        traitsToUse.map((trait) => [trait, computed(() => traits.value?.[trait])])
    ) as ComputedObject<T, IFlagsmithTrait | undefined>
}

export const useFlagsmithLoading = (): {
    [K in keyof LoadingState]: ComputedRef<LoadingState[K]>
} => {
    const { loadingState } = injectHelper()
    return {
        error: computed(() => loadingState.value?.error ?? null),
        isFetching: computed(() => Boolean(loadingState.value?.isFetching)),
        isLoading: computed(() => Boolean(loadingState.value?.isLoading)),
        source: computed(() => loadingState.value?.source ?? ('NONE' as FlagSource)),
    }
}
