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

## Quick Start

This section provides a quick way to get `flagsmith-vue` integrated into your Vue application.

**Step 1: Initialize Flagsmith in your main application component**

First, you need to initialize the Flagsmith client using the `useFlagsmith` composable. This is typically done once in your root Vue component (e.g., `App.vue`) or in your `main.ts` file if you are providing it at the application level.

```typescript
// App.vue (or your main application component)
import { defineComponent } from 'vue';
import { useFlagsmith } from 'flagsmith-vue';

export default defineComponent({
  name: 'App',
  setup() {
    useFlagsmith({
      environmentID: 'YOUR_ENVIRONMENT_ID', // Replace with your actual Environment ID
      // Optional: Add other Flagsmith initialization options here
      // cacheFlags: true,
      // enableAnalytics: true,
    });

    // ... rest of your App setup
    return {}; // Ensure setup returns an object if not using <script setup>
  },
});
```
Remember to replace `'YOUR_ENVIRONMENT_ID'` with your actual Flagsmith Environment ID. You can find this in your Flagsmith project settings.

**Step 2: Access Feature Flags in your components**

Once Flagsmith is initialized, you can access your feature flags in any child component using the `useFlags` composable.

```typescript
// MyComponent.vue (any component in your application)
import { defineComponent } from 'vue';
import { useFlags } from 'flagsmith-vue';

export default defineComponent({
  name: 'MyComponent',
  setup() {
    // Request the flags you need for this component
    const flags = useFlags(['hero_banner_enabled', 'show_new_feature_button']);

    // You can then use the flags in your component's template or logic.
    //
    // To check if a flag is enabled:
    // const isHeroBannerEnabled = flags.hero_banner_enabled.value?.enabled;
    //
    // To get a remote config value (if the flag has one):
    // const buttonText = flags.show_new_feature_button.value?.value || 'Default Text';

    return {
      flags, // Expose the reactive flags object to the template
      // Example of exposing a specific computed property for convenience:
      // isHeroBannerEnabled: computed(() => flags.hero_banner_enabled.value?.enabled),
      // buttonText: computed(() => flags.show_new_feature_button.value?.value || 'Default Text'),
    };
  },
  // Example template usage (if not using <script setup>):
  // template: `
  //   <div>
  //     <div v-if="flags.hero_banner_enabled.value?.enabled">
  //       <!-- Hero Banner Content Here -->
  //       <p>Hero Banner is ON!</p>
  //     </div>
  //     <button v-if="flags.show_new_feature_button.value?.enabled">
  //       {{ flags.show_new_feature_button.value?.value || 'New Feature' }}
  //     </button>
  //   </div>
  // `
});
```
In the example above:
- `flags.hero_banner_enabled.value?.enabled` checks if the `hero_banner_enabled` feature flag is turned on.
- `flags.show_new_feature_button.value?.value` retrieves the remote configuration value associated with the `show_new_feature_button` flag. If the flag has no value or is disabled, it falls back to `'Default Text'` (or `'New Feature'` in the template example).

**Further Steps**

This quick start covers the basics of initializing Flagsmith and accessing feature flags. For more advanced features, such as:
- Managing user identity and traits with `useTraits`
- Monitoring the SDK's loading status with `useFlagsmithLoading`
- Directly interacting with the Flagsmith SDK instance using `useFlagsmithInstance`

Please refer to the detailed "Detailed API Reference" section that follows.

## Detailed API Reference

This section details the API and usage for each of the composable functions provided by `flagsmith-vue`.

### `useFlagsmith`

The `useFlagsmith` composable initializes the Flagsmith integration. It is crucial to call this function **once** in your root or main application component (e.g., `App.vue`) during the application's setup phase. This function sets up the necessary context for other composables to access Flagsmith data.

*   **Parameters**:
    *   `options: IInitConfig`: (Required) The configuration options for initializing the Flagsmith client. This object includes your `environmentID` and other settings. For a detailed list of all available options, refer to the [Flagsmith initialization options](https://docs.flagsmith.com/clients/javascript#initialisation-options).
    *   `flagsmithInstance?: IFlagsmith`: (Optional) An existing Flagsmith JavaScript SDK instance. If you have a specific need to use a pre-configured instance, you can pass it here. Otherwise, the composable will create a new instance.

*   **Return Value**:
    *   Type: `FlagsmithHelper`
    *   Description: Returns a `FlagsmithHelper` object which contains:
        *   `flags: Ref<IFlags | undefined>`: A Vue `ref` to the object containing all feature flags.
        *   `traits: Ref<ITraits | undefined>`: A Vue `ref` to the object containing all user traits.
        *   `loadingState: Ref<LoadingState | undefined>`: A Vue `ref` to an object representing the SDK's loading status.
        *   `flagsmithInstance: IFlagsmith`: The direct instance of the Flagsmith JavaScript SDK. This is **not** a Vue `ref`.

*   **Usage Example**:

    ```typescript
    // In your root/parent component setup (e.g., App.vue)
    import { useFlagsmith } from 'flagsmith-vue';

    useFlagsmith({
      environmentID: 'YOUR_ENVIRONMENT_ID',
      // enableAnalytics: true, // Example of another option
      // ... other initialization options
    });
    ```
    Once `useFlagsmith` is initialized in your root component, you can use the other composables (`useFlags`, `useTraits`, `useFlagsmithLoading`, `useFlagsmithInstance`) in any of your child components.

### `useFlags`

The `useFlags` composable is used to access specific feature flags within your components. You provide it with an array of flag names you're interested in, and it returns reactive computed properties for those flags.

*   **Parameters**:
    *   `flagsToUse: FKey<F>[]`: (Required) An array of flag names (strings) that you want to retrieve from Flagsmith.
    *   `flagsmithHelper?: FlagsmithHelper<F, T>`: (Optional) An optional `FlagsmithHelper` instance. If not provided, the globally available helper (initialized by `useFlagsmith` in your root component) is automatically used.

*   **Return Value**:
    *   Type: `Object` where each key is a flag name from `flagsToUse`.
    *   Description: Returns an object where each key corresponds to a flag name you requested. The value for each key is a Vue `ComputedRef<IFlagsmithFeature | undefined>`. This `ComputedRef` holds the flag object itself (or `undefined` if the flag doesn't exist or hasn't been loaded yet).
    *   To access specific properties of the flag, such as its `enabled` status or remote config `value`, you need to use `.value` on the `ComputedRef` (e.g., `flags.my_feature_flag.value?.enabled`).

*   **Usage Example**:

    ```typescript
    // In your component setup
    import { useFlags } from 'flagsmith-vue';

    const flags = useFlags(['my_feature_flag', 'another_flag_with_config']);

    // Example: Check if a feature is enabled
    // if (flags.my_feature_flag.value?.enabled) {
    //   console.log('My feature is enabled!');
    // }

    // Example: Get a remote config value
    // const configValue = flags.another_flag_with_config.value?.value;
    // if (configValue) {
    //   console.log('Remote config value:', configValue);
    // }
    ```

### `useTraits`

The `useTraits` composable allows you to access specific user traits that have been set for the current user. Similar to `useFlags`, you provide an array of trait names, and it returns reactive computed properties for those traits.

*   **Parameters**:
    *   `traitsToUse: T[]`: (Required) An array of trait names (strings) that you want to retrieve.
    *   `flagsmithHelper?: FlagsmithHelper<F, T>`: (Optional) An optional `FlagsmithHelper` instance. If not provided, the globally available helper is used.

*   **Return Value**:
    *   Type: `Object` where each key is a trait name from `traitsToUse`.
    *   Description: Returns an object where each key corresponds to a trait name you requested. The value for each key is a Vue `ComputedRef<IFlagsmithTrait | undefined>`. This `ComputedRef` holds the trait object (or `undefined` if the trait doesn't exist or hasn't been loaded).
    *   To access the actual value of the trait, you need to use `.value` on the `ComputedRef` (e.g., `traits.user_role.value?.value`).

*   **Usage Example**:

    ```typescript
    // In your component setup
    import { useTraits } from 'flagsmith-vue';

    const traits = useTraits(['user_role', 'beta_tester_status']);

    // Example: Access trait values
    // const userRole = traits.user_role.value?.value;
    // if (userRole === 'admin') {
    //   console.log('User is an admin.');
    // }

    // const isBetaTester = traits.beta_tester_status.value?.value;
    // if (isBetaTester) {
    //   console.log('User is a beta tester.');
    // }
    ```

### `useFlagsmithLoading`

The `useFlagsmithLoading` composable provides detailed reactive status information about the Flagsmith SDK's loading and fetching states. This is useful for building responsive UIs that react to these states (e.g., showing loading indicators or error messages).

*   **Parameters**:
    *   `flagsmithHelper?: FlagsmithHelper<F, T>`: (Optional) An optional `FlagsmithHelper` instance. If not provided, the globally available helper is used.

*   **Return Value**:
    *   Type: `Object`
    *   Description: Returns an object containing the following Vue `ComputedRef`s:
        *   `error: ComputedRef<Error | null>`: Holds an error object if an error occurred during the SDK's initialization or while fetching updates. It will be `null` if there's no error.
        *   `isFetching: ComputedRef<boolean>`: A boolean `ComputedRef` that is `true` when the SDK is actively fetching flags or traits from the server (e.g., after an `identify` call or a real-time update).
        *   `isLoading: ComputedRef<boolean>`: A boolean `ComputedRef` that is `true` during the initial loading process when the SDK is first initializing and fetching data.
        *   `source: ComputedRef<FlagSource>`: A `ComputedRef<FlagSource>` indicating the source of the current flag data. Possible values include `'SERVER'`, `'CACHE'`, `'DEFAULT_FLAGS'`, or `'NONE'`. This can be useful for debugging or understanding how the flags were loaded.

*   **Usage Example**:

    ```typescript
    // In your component setup
    import { useFlagsmithLoading } from 'flagsmith-vue';

    const { isLoading, isFetching, error, source } = useFlagsmithLoading();

    // Example usage in your template:
    // <div v-if="isLoading.value">Loading initial flags...</div>
    // <div v-if="isFetching.value">Updating flags in the background...</div>
    // <div v-if="error.value">An error occurred: {{ error.value.message }}</div>
    // <p>Flags loaded from: {{ source.value }}</p>
    ```

### `useFlagsmithInstance`

The `useFlagsmithInstance` composable provides direct access to the underlying Flagsmith JavaScript SDK instance. This is useful for more advanced scenarios where you might need to call methods directly on the SDK, such as identifying users, manually setting traits, or using other functionalities not exposed by the other composables.

*   **Parameters**:
    *   `flagsmithHelper?: FlagsmithHelper<F, T>`: (Optional) An optional `FlagsmithHelper` instance. If not provided, the globally available helper is used.

*   **Return Value**:
    *   Type: `IFlagsmith`
    *   Description: Returns the direct `IFlagsmith` SDK instance. Since `useFlagsmith` (which should be called in your root component) initializes and provides this instance, and `useFlagsmithInstance` injects it, the instance should generally be available. You can rely on TypeScript's type system or perform a simple check if necessary.

*   **Usage Example**:

    ```typescript
    // In your component setup
    import { useFlagsmithInstance } from 'flagsmith-vue';

    const flagsmithInstance = useFlagsmithInstance();

    async function identifyUserAndSetCustomTrait(userId: string, traitKey: string, traitValue: any) {
      try {
        // The flagsmithInstance is directly usable.
        await flagsmithInstance.identify(userId); // Ensure identify completes if you need to wait for it
        await flagsmithInstance.setTrait(traitKey, traitValue);
        console.log(`Trait '${traitKey}' set for user '${userId}'.`);

        // Example of setting multiple traits at once:
        // await flagsmithInstance.setTraits({ another_trait: 'another_value', user_segment: 'A' });

        // For anonymous users, you might just set traits without explicitly identifying:
        // await flagsmithInstance.setTraits({ example_anonymous_trait: traitValue });
      } catch (error) {
        console.error('Flagsmith API error:', error);
      }
    }

    // Call this function when appropriate in your component logic
    // identifyUserAndSetCustomTrait('unique_user_id_123', 'custom_user_property', 'property_value');
    ```
    For the complete list of available methods and functionalities on the Flagsmith instance, please refer to the official [Flagsmith JavaScript Client SDK documentation](https://docs.flagsmith.com/clients/javascript).

## License

Unless otherwise noted, all source code is licensed under the MIT License.  
Copyright (c) 2025 Jochen Hörmann
