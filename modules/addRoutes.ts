// https://github.com/nuxt-modules/prismic/blob/master/src/module.ts
import { createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'

export default defineNuxtModule({
    setup(options) {
        const resolver = createResolver(import.meta.url)

        extendPages((pages) => {
            pages.unshift(
                {
                    name: 'detachedFlags',
                    path: '/detachedFlags',
                    file: resolver.resolve('../components/settings/dispatch/Flags.vue')
                },
                {
                    name: 'yardDetail',
                    path: '/yard_check/yardDetail/:id',
                    file: resolver.resolve('../components/yardCheck/YardDetails.vue')
                }
            )
        })
    }
})