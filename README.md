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

The recommended way to initialize Flagsmith is by installing it as a Vue plugin, which makes it available throughout your application. Alternatively, for more localized use within specific component trees, you can use the `useFlagsmith` composable.

### Step 1: Initialize Flagsmith

**Recommended: Initialize by Installing as a Vue Plugin**

In your main application file (e.g., `main.ts` or `main.js`), import and use the plugin. Replace `YOUR_ENVIRONMENT_ID` with your actual ID. For more init options, see [Flagsmith initialization options](https://docs.flagsmith.com/clients/javascript#initialisation-options).

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import flagsmithVue from 'flagsmith-vue'

const app = createApp(App)

app.use(flagsmithVue, {
    environmentID: 'YOUR_ENVIRONMENT_ID',
    // Add any other Flagsmith initialization options here
})

app.mount('#app')
```

**Alternative: Initialize with `useFlagsmith`**

This method is suitable if you only need Flagsmith functionality within a specific part of your application (e.g., a single component tree) rather than globally.

In your main app component for that specific tree (e.g., `App.vue` or a specific feature component), initialize Flagsmith. Replace `YOUR_ENVIRONMENT_ID` with your actual ID. For more init options, see [Flagsmith initialization options](https://docs.flagsmith.com/clients/javascript#initialisation-options).

```typescript
// App.vue (using <script setup>) or main.ts
import { useFlagsmith } from 'flagsmith-vue'

useFlagsmith({ environmentID: 'YOUR_ENVIRONMENT_ID' })
```

### Step 2: Accessing Flags and Traits in Components

Regardless of the initialization method chosen, you can access flags and traits in any child component within the scope of the initialized Flagsmith instance.

For flags, use `useFlags` to get the desired flags. Access `yourFlag.value?.enabled` for enabled status and `yourFlag.value?.value` for the flag's value. Similarly, `useTraits` can be used for accessing user traits.

```typescript
// MyComponent.vue (using <script setup>)
import { useFlags } from 'flagsmith-vue'

const flags = useFlags(['my_feature', 'feature_with_value'])

// Check if a flag is enabled:
// if (flags.my_feature.value?.enabled) { /* ... */ }

// Get a remote config value:
// const configValue = flags.feature_with_value.value?.value;
```

## API Reference

<details>
<summary><code>useFlagsmith</code></summary>

Initializes the Flagsmith integration. Call once in your root component (e.g., `App.vue`).

- **Parameters**:
    - `options: IInitConfig` (Required): Flagsmith client initialization options (see [Flagsmith docs](https://docs.flagsmith.com/clients/javascript#initialisation-options)).
    - `flagsmithInstance?: IFlagsmith` (Optional): An existing Flagsmith SDK instance.
- **Returns**: `FlagsmithHelper` - An object containing:
    - `flags: Ref<IFlags | undefined>` - Reactive flags object.
    - `traits: Ref<ITraits | undefined>` - Reactive traits object.
    - `loadingState: Ref<LoadingState | undefined>` - Reactive SDK loading status.
    - `flagsmithInstance: IFlagsmith` - Direct Flagsmith SDK instance.
- **Usage Example**:
    ```typescript
    import { useFlagsmith } from 'flagsmith-vue'
    useFlagsmith({ environmentID: 'YOUR_ENVIRONMENT_ID' })
    ```

</details>

<details>
<summary><code>useFlags</code></summary>

Accesses specified feature flags reactively.

- **Parameters**:
    - `flagsToUse: FKey<F>[]` (Required): Array of flag names to retrieve.
    - `flagsmithHelper?: FlagsmithHelper<F, T>` (Optional): `FlagsmithHelper` instance (uses global if not provided).
- **Returns**: `Object` - Keys are flag names, values are `ComputedRef<IFlagsmithFeature | undefined>`. Access flag properties via `.value` (e.g., `flags.my_flag.value?.enabled`).
- **Usage Example**:
    ```typescript
    import { useFlags } from 'flagsmith-vue'
    const flags = useFlags(['feature_one', 'feature_two'])
    // if (flags.feature_one.value?.enabled) { /* ... */ }
    // const value = flags.feature_two.value?.value;
    ```

</details>

<details>
<summary><code>useTraits</code></summary>

Accesses specified user traits reactively.

- **Parameters**:
    - `traitsToUse: T[]` (Required): Array of trait names to retrieve.
    - `flagsmithHelper?: FlagsmithHelper<F, T>` (Optional): `FlagsmithHelper` instance (uses global if not provided).
- **Returns**: `Object` - Keys are trait names, values are `ComputedRef<IFlagsmithTrait | undefined>`. Access trait properties via `.value` (e.g., `traits.my_trait.value?.value`).
- **Usage Example**:
    ```typescript
    import { useTraits } from 'flagsmith-vue'
    const traits = useTraits(['user_type', 'preferred_color'])
    // const userType = traits.user_type.value?.value;
    ```

</details>

<details>
<summary><code>useFlagsmithLoading</code></summary>

Provides reactive status information about the SDK's loading and fetching states.

- **Parameters**:
    - `flagsmithHelper?: FlagsmithHelper<F, T>` (Optional): `FlagsmithHelper` instance (uses global if not provided).
- **Returns**: `Object` - Contains `ComputedRef`s for SDK states:
    - `error: ComputedRef<Error | null>` - Error object if an error occurred.
    - `isFetching: ComputedRef<boolean>` - True if actively fetching.
    - `isLoading: ComputedRef<boolean>` - True during initial load.
    - `source: ComputedRef<FlagSource>` - Source of flag data (`'SERVER'`, `'CACHE'`, etc.).
- **Usage Example**:
    ```typescript
    import { useFlagsmithLoading } from 'flagsmith-vue'
    const { isLoading, isFetching, error, source } = useFlagsmithLoading()
    // <div v-if="isLoading.value">Loading...</div>
    ```

</details>

<details>
<summary><code>useFlagsmithInstance</code></summary>

Provides direct access to the underlying Flagsmith JavaScript SDK instance for advanced use cases.

- **Parameters**:
    - `flagsmithHelper?: FlagsmithHelper<F, T>` (Optional): `FlagsmithHelper` instance (uses global if not provided).
- **Returns**: `IFlagsmith` - The direct Flagsmith SDK instance.
- **Usage Example**:
    ```typescript
    import { useFlagsmithInstance } from 'flagsmith-vue'
    const flagsmithInstance = useFlagsmithInstance()
    // flagsmithInstance.identify('user_id');
    // flagsmithInstance.setTrait('example_trait', 123);
    ```
    Refer to the official [Flagsmith JavaScript Client SDK documentation](https://docs.flagsmith.com/clients/javascript) for all available SDK methods.

</details>

## License

Unless otherwise noted, all source code is licensed under the MIT License.  
Copyright (c) 2025 Jochen Hörmann
