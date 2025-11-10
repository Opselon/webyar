// src/routes/contact.mjs
import { streamRenderedPage } from '../utils/renderer.mjs';
import { streamHtml } from '../utils/response.mjs';
import contactTemplate from '../templates/contact.html';
import { generateSeoMeta } from '../utils/seo.mjs';

export async function handleContact(request) {
  if (request.method === 'POST') {
    // Handle form submission
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    console.log('Form Submitted:', { name, email, message });

    // =================================================================
    // PRODUCTION NOTE:
    // To send an actual email, you need to integrate a third-party
    // email service provider like Mailgun, SendGrid, or Resend.
    // You would typically make a fetch() call to their API here,
    // passing the form data and your API key (stored as a secret).
    // Example:
    //
    // const emailResponse = await fetch('https://api.mailgun.net/v3/YOUR_DOMAIN/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Basic ' + btoa('api:YOUR_API_KEY')
    //   },
    //   body: new URLSearchParams({
    //     from: 'Excited User <mailgun@YOUR_DOMAIN>',
    //     to: 'you@example.com',
    //     subject: 'New Contact Form Submission',
    //     text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    //   })
    // });
    //
    // if (!emailResponse.ok) {
    //   console.error('Failed to send email');
    // }
    // =================================================================

    const successTemplate = `
      <div class="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 class="text-2xl font-bold text-green-600 mb-4">پیام شما با موفقیت ارسال شد!</h1>
        <p>از تماس شما سپاسگزاریم. به زودی با شما تماس خواهیم گرفت.</p>
        <a href="/" class="mt-4 inline-block text-blue-500 hover:underline">بازگشت به صفحه اصلی</a>
      </div>
    `;

    return html(renderPage(successTemplate, {
        seo: generateSeoMeta({ title: 'پیام ارسال شد', description: 'پیام شما با موفقیت ارسال شد.' })
    }));
  }

  // Handle GET request (show the form)
  const seoData = generateSeoMeta({
    title: 'تماس با ما | مشاوره رایگان سئو',
    description: 'برای دریافت مشاوره رایگان سئو و اطلاعات بیشتر با تیم ما تماس بگیرید.',
    canonical: 'https://your-domain.com/contact',
  });

  const stream = streamRenderedPage(contactTemplate, {
    seo: seoData,
  });

  return streamHtml(stream);
}
