# flagsmith-vue

> An (unofficial) [Flagsmith](https://www.flagsmith.com) Vue.js integration that uses [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) to dynamically update feature flags and traits in components. Compatible with Vue.js versions `2.7` and `3`.

[![npm][badge-npm]][npm] [![GitHub][badge-github]][github] [![GitHub tests workflow][badge-actions]][actions] [![Codacy Code Quality][badge-codacy]][codacy] [![Codacy Coverage][badge-coverage]][codacy]

[npm]: https://www.npmjs.com/package/flagsmith-vue
[github]: https://github.com/jhoermann/flagsmith-vue
[actions]: https://github.com/jhoermann/flagsmith-vue/actions/workflows/tests.yml?query=branch%3Amain
[codacy]: https://app.codacy.com/gh/jhoermann/flagsmith-vue/dashboard

[badge-npm]: https://img.shields.io/npm/v/flagsmith-vue?logo=npm&logoColor=white&color=red
[badge-github]: https://img.shields.io/github/package-json/v/jhoermann/flagsmith-vue?logo=github&color=blue
[badge-actions]: https://img.shields.io/github/actions/workflow/status/jhoermann/flagsmith-vue/tests.yml?logo=github&label=Tests
[badge-codacy]: https://img.shields.io/codacy/grade/27a356f30e97429e9c8c0b865e41240a?logo=codacy
[badge-coverage]: https://img.shields.io/codacy/coverage/27a356f30e97429e9c8c0b865e41240a?logo=codacy

## Installation

```bash
npm install flagsmith-vue flagsmith
```

## Usage

### `useFlagsmith`

The `useFlagsmith` composable initializes the Flagsmith integration. It is crucial to call this function **once** in your root or main application component (e.g., `App.vue`) during the application's setup phase.

```typescript
import { useFlagsmith } from 'flagsmith-vue';

// In your root/parent component setup (e.g., App.vue)
useFlagsmith({
  environmentID: 'YOUR_ENVIRONMENT_ID',
  // Additional options...
});
```

For the full list of `options` you can pass during initialization, please refer to the official [Flagsmith JavaScript Client SDK documentation on initialization options](https://docs.flagsmith.com/clients/javascript#initialisation-options).

Once initialized, you can use the other composables (`useFlags`, `useTraits`, `useFlagsmithLoading`, `useFlagsmithInstance`) in any of your child components.

### `useFlags`

The `useFlags` composable is used to access specific feature flags within your components. You provide it with an array of flag names you're interested in.

```typescript
import { useFlags } from 'flagsmith-vue';

// In your component setup
const flags = useFlags(['my_feature_flag', 'another_flag']);

// You can then access the flags in your template or script:
// Check if a feature is enabled:
// if (flags.my_feature_flag.value?.enabled) { /* ... */ }

// Get a remote config value:
// const configValue = flags.another_flag.value?.value;
```

This composable returns an object where each key is a flag name from your input array. The value for each key is a Vue `ComputedRef` that holds the flag object itself (or `undefined` if the flag doesn't exist or hasn't been loaded yet). The actual flag data, such as its `enabled` status or its remote config `value`, is available on the `.value` property of this `ComputedRef`. For example, to check if `my_feature_flag` is enabled, you would use `flags.my_feature_flag.value?.enabled`.

### `useTraits`

The `useTraits` composable allows you to access specific user traits that have been set for the current user. Similar to `useFlags`, you pass it an array of trait names.

```typescript
import { useTraits } from 'flagsmith-vue';

// In your component setup
const traits = useTraits(['user_role', 'beta_tester']);

// Access trait values:
// const userRole = traits.user_role.value?.value;
// const isBetaTester = traits.beta_tester.value?.value;
```

This composable returns an object where each key is a trait name. The value for each key is a Vue `ComputedRef` holding the trait object (or `undefined` if the trait doesn't exist or hasn't been loaded). The trait's actual value is available on the `.value` property of this `ComputedRef` (e.g., `traits.user_role.value?.value`).

### `useFlagsmithLoading`

The `useFlagsmithLoading` composable provides detailed status information about the Flagsmith SDK's loading and fetching state. This is useful for building responsive UIs that react to these states (e.g., showing loading indicators or error messages).

```typescript
import { useFlagsmithLoading } from 'flagsmith-vue';

// In your component setup
const { isLoading, isFetching, error, source } = useFlagsmithLoading();

// Example usage in your template:
// <div v-if="isLoading.value">Loading flags...</div>
// <div v-if="isFetching.value">Updating flags...</div>
// <div v-if="error.value">Error: {{ error.value.message }}</div>
// <p>Flags loaded from: {{ source.value }}</p>
```

The composable returns an object with the following properties, all of which are Vue `ComputedRef`s:

*   `error`: A `ComputedRef` that holds any error object if an error occurred during the SDK's initialization or while fetching updates. It will be `null` if there's no error.
*   `isFetching`: A boolean `ComputedRef` that is `true` when the SDK is actively fetching flags or traits from the server (e.g., after an `identify` call or a real-time update).
*   `isLoading`: A boolean `ComputedRef` that is `true` during the initial loading process when the SDK is first initializing and fetching data.
*   `source`: A `ComputedRef<FlagSource>` indicating the source of the current flag data. Possible values include `'SERVER'`, `'CACHE'`, `'DEFAULT_FLAGS'`, or `'NONE'`. This can be useful for debugging or understanding how the flags were loaded.

### `useFlagsmithInstance`

The `useFlagsmithInstance` composable provides direct access to the underlying Flagsmith JavaScript SDK instance. This is useful for more advanced scenarios where you might need to call methods directly on the SDK, such as identifying users, manually setting traits, or using other functionalities not exposed by the other composables.

```typescript
import { useFlagsmithInstance } from 'flagsmith-vue';

// In your component setup
const flagsmithInstance = useFlagsmithInstance();

function identifyUserAndSetTrait(userId: string, traitKey: string, traitValue: any) {
  // The flagsmithInstance is directly usable.
  flagsmithInstance.identify(userId);
  flagsmithInstance.setTrait(traitKey, traitValue);
  // Alternatively, to set multiple traits at once:
  // flagsmithInstance.setTraits({ [traitKey]: traitValue, another_trait: 'another_value' });

  // For anonymous users, you might just set traits without identifying:
  // flagsmithInstance.setTraits({ example_trait: traitValue });
}
```

The `useFlagsmithInstance` composable returns the Flagsmith JavaScript SDK instance directly. Since `useFlagsmith` (which should be called in your root component) initializes and provides this instance, and `useFlagsmithInstance` injects it, the instance should generally be available. You can rely on TypeScript's type system or perform a simple check if necessary, but you do not need to access it via `.value`.

For the complete list of available methods and functionalities on the Flagsmith instance, please refer to the official [Flagsmith JavaScript Client SDK documentation](https://docs.flagsmith.com/clients/javascript).

## Composable Functions API

This section details the API for each of the composable functions provided by `flagsmith-vue`.

### `useFlagsmith`

Initializes the Flagsmith integration and provides a helper object for interacting with the SDK.

*   **Parameters**:
    *   `options: IInitConfig`: The configuration options for initializing the Flagsmith client. See [Flagsmith initialization options](https://docs.flagsmith.com/clients/javascript#initialisation-options) for detailed information.
    *   `flagsmithInstance?: IFlagsmith` (optional): An optional existing Flagsmith JavaScript SDK instance. If not provided, a new instance will be created.
*   **Return Value**:
    *   Returns a `FlagsmithHelper` object. This object contains reactive Vue `ref`s for `flags`, `traits`, and `loadingState`. The `flagsmithInstance` property within this helper object is the direct Flagsmith SDK instance (not a `ref`).

### `useFlags`

Accesses specified feature flags and provides them as reactive Vue `ComputedRef`s.

*   **Parameters**:
    *   `flagsToUse: FKey<F>[]`: An array of flag names (strings) to retrieve.
    *   `flagsmithHelper?: FlagsmithHelper<F, T>` (optional): An optional `FlagsmithHelper` instance. If not provided, the globally available helper (initialized by `useFlagsmith`) is used.
*   **Return Value**:
    *   Returns an object where each key is a flag name from the `flagsToUse` array. The corresponding value is a Vue `ComputedRef<IFlagsmithFeature | undefined>`. This `ComputedRef` holds the flag object itself (or `undefined` if not found/loaded). To access specific properties of the flag, such as its `enabled` status or remote config `value`, you would use `.value` on the `ComputedRef` (e.g., `flags.my_flag.value?.enabled`).

### `useTraits`

Accesses specified user traits and provides them as reactive Vue `ComputedRef`s.

*   **Parameters**:
    *   `traitsToUse: T[]`: An array of trait names (strings) to retrieve.
    *   `flagsmithHelper?: FlagsmithHelper<F, T>` (optional): An optional `FlagsmithHelper` instance. If not provided, the globally available helper is used.
*   **Return Value**:
    *   Returns an object where each key is a trait name from the `traitsToUse` array. The corresponding value is a Vue `ComputedRef<IFlagsmithTrait | undefined>`. This `ComputedRef` holds the trait object itself (or `undefined` if not found/loaded). To access the actual value of the trait, you would use `.value` on the `ComputedRef` (e.g., `traits.my_trait.value?.value`).

### `useFlagsmithLoading`

Provides detailed reactive status information about the Flagsmith SDK's loading and fetching states.

*   **Parameters**:
    *   `flagsmithHelper?: FlagsmithHelper<F, T>` (optional): An optional `FlagsmithHelper` instance. If not provided, the globally available helper is used.
*   **Return Value**:
    *   Returns an object containing the following Vue `ComputedRef`s:
        *   `error: ComputedRef<Error | null>`: Holds an error object if an error occurred, otherwise `null`.
        *   `isFetching: ComputedRef<boolean>`: `true` if the SDK is currently fetching data.
        *   `isLoading: ComputedRef<boolean>`: `true` if the SDK is performing its initial load.
        *   `source: ComputedRef<FlagSource>`: Indicates the source of the flag data (e.g., `'SERVER'`, `'CACHE'`).

### `useFlagsmithInstance`

Provides direct access to the underlying Flagsmith JavaScript SDK instance.

*   **Parameters**:
    *   `flagsmithHelper?: FlagsmithHelper<F, T>` (optional): An optional `FlagsmithHelper` instance. If not provided, the globally available helper is used.
*   **Return Value**:
    *   Returns the direct `IFlagsmith` SDK instance, allowing direct interaction with the Flagsmith JavaScript SDK.

## License

Unless otherwise noted, all source code is licensed under the MIT License.  
Copyright (c) 2025 Jochen Hörmann
