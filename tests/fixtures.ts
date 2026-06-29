import { test as base } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type AxeFixture = {
    makeAxeBuilder: () => AxeBuilder
}

export const test = base.extend<AxeFixture>({
    makeAxeBuilder: async ({ page }, useFixture) => {
        const makeAxeBuilder = () =>
            new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'best-practice'])
                .exclude('pre')

        await useFixture(makeAxeBuilder)
    }
})

export { expect } from '@playwright/test'
