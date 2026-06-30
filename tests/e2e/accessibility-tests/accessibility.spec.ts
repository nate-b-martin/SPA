import { test, expect } from '../../fixtures'
import type { Page } from '@playwright/test'
import type AxeBuilder from '@axe-core/playwright'
import { HomePage } from '../page-objects/HomePage'
import { ExperiencesPage } from '../page-objects/ExperiencesPage'
import { PostsPage } from '../page-objects/PostsPage'
import { ContactPage } from '../page-objects/ContactPage'

async function runAxeTest(
    page: Page,
    makeAxeBuilder: () => AxeBuilder
) {
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)))
    await page.waitForTimeout(800)
    const results = await makeAxeBuilder().analyze()
    expect(results.violations).toEqual([])
}

async function toggleLightTheme(page: Page) {
    const currentTheme = await page.locator('html').getAttribute('class')
    if(currentTheme?.includes('dark')) {
        await page.getByLabel(/switch to .* theme/i).click()
    }
    await expect(page.locator('html.light')).toBeVisible()
    await page.waitForTimeout(300)
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)))
    await page.waitForTimeout(500)
}

async function toggleDarkTheme(page: Page) {
    const currentTheme = await page.locator('html').getAttribute('class')
    if(currentTheme?.includes('light')) {
        await page.getByLabel(/switch to .* theme/i).click()
    }
    await expect(page.locator('html.dark')).toBeVisible()
    await page.waitForTimeout(300)
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)))
    await page.waitForTimeout(500)
}

test.describe('Accessibility - Homepage', () => {
    test('should have no accessibility violations', async ({
        page,
        makeAxeBuilder
    }) => {
        const home = new HomePage(page)
        await home.goto()
        await expect(home.heading()).toBeVisible()
        await expect(home.recentPostsSection()).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - toggle theme', async ({
        page,
        makeAxeBuilder
    }) => {
        const home = new HomePage(page)
        await home.goto()
        await expect(home.heading()).toBeVisible()
        await toggleLightTheme(page)
        await runAxeTest(page, makeAxeBuilder)
        await toggleDarkTheme(page)
        await runAxeTest(page, makeAxeBuilder)
    })
})

test.describe('Accessibility - Experiences', () => {
    test('should have no accessibility violations', async ({
        page,
        makeAxeBuilder
    }) => {
        const experiences = new ExperiencesPage(page)
        await experiences.goto()
        await expect(experiences.heading()).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - toggle theme', async ({
        page,
        makeAxeBuilder
    }) => {
        const experiences = new ExperiencesPage(page)
        await experiences.goto()
        await expect(experiences.heading()).toBeVisible()
        await toggleLightTheme(page)
        await runAxeTest(page, makeAxeBuilder)
        await toggleDarkTheme(page)
        await runAxeTest(page, makeAxeBuilder)
    })
})

test.describe('Accessibility - Posts', () => {
    test('should have no accessibility violations', async ({
        page,
        makeAxeBuilder
    }) => {
        const posts = new PostsPage(page)
        await posts.goto()
        await expect(posts.heading()).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - toggle theme', async ({
        page,
        makeAxeBuilder
    }) => {
        const posts = new PostsPage(page)
        await posts.goto()
        await expect(posts.heading()).toBeVisible()
        await toggleLightTheme(page)
        await runAxeTest(page, makeAxeBuilder)
        await toggleDarkTheme(page)
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - search', async ({
        page,
        makeAxeBuilder
    }) => {
        const posts = new PostsPage(page)
        await posts.goto()
        await expect(posts.heading()).toBeVisible()
        await posts.searchPosts('MDX')
        await expect(posts.postLinks().first()).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })
})

test.describe('Accessibility - Contact', () => {
    test('should have no accessibility violations', async ({
        page,
        makeAxeBuilder
    }) => {
        const contact = new ContactPage(page)
        await contact.goto()
        await expect(contact.heading()).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - toggle theme', async ({
        page,
        makeAxeBuilder
    }) => {
        const contact = new ContactPage(page)
        await contact.goto()
        await expect(contact.heading()).toBeVisible()
        await toggleLightTheme(page)
        await runAxeTest(page, makeAxeBuilder)
        await toggleDarkTheme(page)
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - filled form', async ({
        page,
        makeAxeBuilder
    }) => {
        const contact = new ContactPage(page)
        await contact.goto()
        await contact.fillForm({
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message'
        })
        await expect(contact.nameInput()).toHaveValue('Test User')
        await runAxeTest(page, makeAxeBuilder)
    })
})

test.describe('Accessibility - Experience Detail', () => {
    test('should have no accessibility violations', async ({
        page,
        makeAxeBuilder
    }) => {
        const experiences = new ExperiencesPage(page)
        await experiences.goto()
        await experiences.projectLinks().first().click()
        await expect(page).toHaveURL(/\/experiences\/.+/)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - toggle theme', async ({
        page,
        makeAxeBuilder
    }) => {
        const experiences = new ExperiencesPage(page)
        await experiences.goto()
        await experiences.projectLinks().first().click()
        await expect(page).toHaveURL(/\/experiences\/.+/)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await toggleLightTheme(page)
        await runAxeTest(page, makeAxeBuilder)
        await toggleDarkTheme(page)
        await runAxeTest(page, makeAxeBuilder)
    })
})

test.describe('Accessibility - Post Detail', () => {
    test('should have no accessibility violations', async ({
        page,
        makeAxeBuilder
    }) => {
        const posts = new PostsPage(page)
        await posts.goto()
        await posts.postLinks().first().click()
        await expect(page).toHaveURL(/\/posts\/.+/)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await runAxeTest(page, makeAxeBuilder)
    })

    test('should have no accessibility violations - toggle theme', async ({
        page,
        makeAxeBuilder
    }) => {
        const posts = new PostsPage(page)
        await posts.goto()
        await posts.postLinks().first().click()
        await expect(page).toHaveURL(/\/posts\/.+/)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await toggleLightTheme(page)
        await runAxeTest(page, makeAxeBuilder)
        await toggleDarkTheme(page)
        await runAxeTest(page, makeAxeBuilder)
    })
})
