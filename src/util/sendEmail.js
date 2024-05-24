import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatePath = path.join(__dirname, 'views/passwordResetTemplate.ejs')


/**
 * Sends a password reset email to the specified email address.
 *
 * @param {Object} fastify - The Fastify instance.
 * @param {string} email - The email address to send the password reset email to.
 * @param {string} name - The name of the recipient.
 * @param {string} resetPasswordUrl - The URL for resetting the password.
 * @throws {Error} If there is an error rendering the email template or sending the email.
 */
const sendPasswordResetEmail = async (fastify, email, name, resetPasswordUrl) => {
    const templateData = { name, resetPasswordUrl }

    let transport = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '56482e26a90aec',
            pass: 'f63863edae999f'
        }
    })

    ejs.renderFile(templatePath, templateData, async (error, html) => {
        if (error) {
            fastify.log.error(error)
            throw error
        }
        try {
            await transport.sendMail({
                from: '\'Laurentiu Iepurentiu\' <laurentiuiepurentiu@rabbit.com>',
                to: email,
                subject: 'Informare',
                html: html
            })
        } catch (error) {
            fastify.log.error(error)
            throw error
        }
    })
}

export { sendPasswordResetEmail }