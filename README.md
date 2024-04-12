# flagsmith-vue

> An (unofficial) [Flagsmith](https://www.flagsmith.com) Vue.js integration that uses [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) to dynamically update feature flags and traits in components. Compatible with Vue.js versions `2.7` and `3`.

[![npm](https://img.shields.io/npm/v/flagsmith-vue?color=red)](https://www.npmjs.com/package/flagsmith-vue) [![GitHub](https://img.shields.io/github/package-json/v/jhoermann/flagsmith-vue?color=blue&logo=github)](https://github.com/jhoermann/flagsmith-vue) ![GitHub test workflow](https://github.com/jhoermann/flagsmith-vue/actions/workflows/tests.yml/badge.svg) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/27a356f30e97429e9c8c0b865e41240a)](https://app.codacy.com/gh/jhoermann/flagsmith-vue/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade) [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/27a356f30e97429e9c8c0b865e41240a)](https://app.codacy.com/gh/jhoermann/flagsmith-vue/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)

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
