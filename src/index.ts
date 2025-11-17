import flagsmith, { FlagSource } from 'flagsmith'
import type {
    IFlags,
    IFlagsmithFeature,
    IFlagsmithTrait,
    ITraits,
    LoadingState,
    IFlagsmith,
    IInitConfig,
} from 'flagsmith/types'
import { computed, inject, provide, ref } from 'vue'
import type { App, ComputedRef, InjectionKey, Ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- typing comes from flagsmith
type Flag = string | Record<string, any>
type FKey<F> = F extends string ? F : keyof F
type UseFlagsReturn<F extends Flag> = [F] extends [string]
    ? {
          [K in F]: ComputedRef<IFlagsmithFeature | undefined>
      }
    : {
          [K in keyof F]: ComputedRef<IFlagsmithFeature<F[K]> | undefined>
      }
type Options<F extends Flag = string, T extends string = string> = IInitConfig<FKey<F>, T>

export interface FlagsmithHelper<F extends Flag = string, T extends string = string> {
    flags: Ref<IFlags<FKey<F>> | undefined>
    traits: Ref<ITraits<T> | undefined>
    loadingState: Ref<LoadingState | undefined>
    flagsmithInstance: IFlagsmith<F, T>
}

const FlagsmithInjectionKey: InjectionKey<FlagsmithHelper> = Symbol('FlagsmithInjectionKey')
const injectHelper = <F extends Flag = string, T extends string = string>(
    flagsmithHelper?: FlagsmithHelper<F, T>
): FlagsmithHelper<F, T> => {
    const helper = flagsmithHelper ?? inject<FlagsmithHelper<F, T>>(FlagsmithInjectionKey)

    if (helper === undefined) {
        throw new TypeError(`Flagsmith vue: Helper should not be undefined.`)
    }

    return helper
}

export const useFlagsmith = <F extends Flag = string, T extends string = string>(
    options: Options<F, T>,
    flagsmithInstance = flagsmith as unknown as IFlagsmith<F, T>,
    app?: App
): FlagsmithHelper<F, T> => {
    const flags = ref<IFlags<FKey<F>>>()
    const traits = ref<ITraits<T>>()
    const loadingState = ref<LoadingState>()

    void flagsmithInstance.init(options)
    flagsmithInstance._trigger = () => {
        flags.value = flagsmithInstance.getAllFlags()
        traits.value = flagsmithInstance.getAllTraits() as ITraits<T>
    }
    flagsmithInstance._triggerLoadingState = () => {
        loadingState.value = flagsmithInstance.loadingState
    }

    const helper: FlagsmithHelper<F, T> = {
        flags,
        traits,
        loadingState,
        flagsmithInstance,
    }
    if (app) {
        app.provide<FlagsmithHelper<F, T>>(FlagsmithInjectionKey, helper)
    } else {
        provide<FlagsmithHelper<F, T>>(FlagsmithInjectionKey, helper)
    }

    return helper
}

type ComputedObject<Key extends string, ComputedValue> = {
    [K in Key]: ComputedRef<ComputedValue>
}

export const useFlags = <F extends Flag = string, T extends string = string>(
    flagsToUse: FKey<F>[],
    flagsmithHelper?: FlagsmithHelper<F, T>
): UseFlagsReturn<F> => {
    const { flags } = injectHelper(flagsmithHelper)
    return Object.fromEntries(
        flagsToUse.map((flag) => [flag, computed(() => flags.value?.[flag])])
    ) as UseFlagsReturn<F>
}

export const useTraits = <F extends Flag = string, T extends string = string>(
    traitsToUse: T[],
    flagsmithHelper?: FlagsmithHelper<F, T>
): ComputedObject<T, IFlagsmithTrait | undefined> => {
    const { traits } = injectHelper(flagsmithHelper)
    return Object.fromEntries(
        traitsToUse.map((trait) => [trait, computed(() => traits.value?.[trait])])
    ) as ComputedObject<T, IFlagsmithTrait | undefined>
}

export const useFlagsmithLoading = <F extends Flag = string, T extends string = string>(
    flagsmithHelper?: FlagsmithHelper<F, T>
): {
    [K in keyof LoadingState]: ComputedRef<LoadingState[K]>
} => {
    const { loadingState } = injectHelper(flagsmithHelper)
    return {
        error: computed(() => loadingState.value?.error ?? null),
        isFetching: computed(() => Boolean(loadingState.value?.isFetching)),
        isLoading: computed(() => Boolean(loadingState.value?.isLoading)),
        source: computed(
            () => (loadingState.value?.source as FlagSource | undefined) ?? FlagSource.NONE
        ),
    }
}

export const useFlagsmithInstance = <F extends Flag = string, T extends string = string>(
    flagsmithHelper?: FlagsmithHelper<F, T>
): IFlagsmith<F, T> => {
    const { flagsmithInstance } = injectHelper(flagsmithHelper)
    return flagsmithInstance
}

// Plugin install function
export default <F extends Flag = string, T extends string = string>(
    app: App,
    options: Options<F, T>
) => {
    useFlagsmith(options, flagsmith as unknown as IFlagsmith<F, T>, app)
}
