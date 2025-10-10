import { Page } from '@playwright/test'

export class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact')
  }

  heading() {
    return this.page.getByRole('heading', { level: 1, name: /contact/i })
  }

  nameInput() {
    return this.page.getByLabel(/name/i)
  }

  emailInput() {
    return this.page.getByLabel(/email/i)
  }

  messageTextarea() {
    return this.page.getByLabel(/message/i)
  }

  submitButton() {
    return this.page.getByRole('button', { name: /send message/i })
  }

  async fillForm(data: { name: string; email: string; message: string }) {
    await this.nameInput().fill(data.name)
    await this.emailInput().fill(data.email)
    await this.messageTextarea().fill(data.message)
  }

  async submitForm() {
    await this.submitButton().click()
  }
}
