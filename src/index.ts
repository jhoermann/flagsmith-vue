import flagsmith from 'flagsmith'
import type {
    IFlags,
    IFlagsmithFeature,
    IFlagsmithTrait,
    IInitConfig,
    ITraits,
    LoadingState,
    FlagSource,
    IFlagsmith,
} from 'flagsmith/types'
import { computed, inject, provide, ref } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface FlagsmithHelper<F extends string = string, T extends string = string> {
    flags: Ref<IFlags<F> | undefined>
    traits: Ref<ITraits<T> | undefined>
    loadingState: Ref<LoadingState | undefined>
    setTrait: IFlagsmith<F, T>['setTrait']
    setTraits: IFlagsmith<F, T>['setTraits']
}
const FlagsmithInjectionKey: InjectionKey<FlagsmithHelper> = Symbol('FlagsmithInjectionKey')
const injectHelper = (flagsmithHelper?: FlagsmithHelper): FlagsmithHelper => {
    const helper = flagsmithHelper ?? inject(FlagsmithInjectionKey)

    if (helper === undefined) {
        throw new TypeError(`Flagsmith vue: Helper should not be undefined.`)
    }

    return helper
}

export const useFlagsmith = <F extends string = string, T extends string = string>(
    options: IInitConfig<F, T>,
    flagsmithInstance = flagsmith
): FlagsmithHelper<F, T> => {
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
        setTrait: flagsmithInstance.setTrait,
        setTraits: flagsmithInstance.setTraits,
    }
    provide(FlagsmithInjectionKey, helper)

    return helper
}

type ComputedObject<Key extends string, ComputedValue> = {
    [K in Key]: ComputedRef<ComputedValue>
}

export const useFlags = <F extends string = string>(
    flagsToUse: F[],
    flagsmithHelper?: FlagsmithHelper
): ComputedObject<F, IFlagsmithFeature | undefined> => {
    const { flags } = injectHelper(flagsmithHelper)
    return Object.fromEntries(
        flagsToUse.map((flag) => [flag, computed(() => flags.value?.[flag])])
    ) as ComputedObject<F, IFlagsmithFeature | undefined>
}

export const useTraits = <T extends string = string>(
    traitsToUse: T[],
    flagsmithHelper?: FlagsmithHelper
): ComputedObject<T, IFlagsmithTrait | undefined> => {
    const { traits } = injectHelper(flagsmithHelper)
    return Object.fromEntries(
        traitsToUse.map((trait) => [trait, computed(() => traits.value?.[trait])])
    ) as ComputedObject<T, IFlagsmithTrait | undefined>
}

export const useFlagsmithLoading = (
    flagsmithHelper?: FlagsmithHelper
): {
    [K in keyof LoadingState]: ComputedRef<LoadingState[K]>
} => {
    const { loadingState } = injectHelper(flagsmithHelper)
    return {
        error: computed(() => loadingState.value?.error ?? null),
        isFetching: computed(() => Boolean(loadingState.value?.isFetching)),
        isLoading: computed(() => Boolean(loadingState.value?.isLoading)),
        source: computed(() => loadingState.value?.source ?? ('NONE' as FlagSource)),
    }
}
