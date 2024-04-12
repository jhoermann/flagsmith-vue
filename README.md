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
