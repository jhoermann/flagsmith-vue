# flagsmith-vue

> [Flagsmith](https://www.flagsmith.com) Vue.js integration that uses [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) to dynamically update feature flags and traits in components.

## Installation

```bash
npm install flagsmith-vue
```

## Usage

Initialize the integration with the `useFlagsmith` helper in your root/parent component:

```ts
import { useFlagsmith } from 'flagsmith-vue'

useFlagsmith(options)
```

For `options` see [Flagsmith initialization options](https://docs.flagsmith.com/clients/javascript#initialisation-options).

Then you can access the flags, traits and loading status inside your child components:

```ts
import { useFlags, useTraits, useFlagsmithLoading } from 'flagsmith-vue'

const flags = useFlags(['flag1', 'flag2', ...])
const traits = useTraits(['trait1', 'trait2', ...])
const flagsmithLoading = useFlagsmithLoading()
```

## License

Unless otherwise noted, all source code is licensed under the MIT License.  
Copyright (c) 2024 Jochen Hörmann
