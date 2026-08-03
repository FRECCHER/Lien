(() => {
  const form = document.querySelector("#contact-form");
  const message = document.querySelector("#contact-form-message");
  const submitButton = document.querySelector("#contact-submit-button");
  const config = window.LIEN_BOOKING_CONFIG || {};

  const setMessage = (text, isError = false) => {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (form.elements.website.value) return;

    if (!config.publicKey || !config.serviceId || !config.contactTemplateId || !window.emailjs) {
      setMessage("ただいまお問い合わせ受付の準備中です。お手数ですが、LINEからお問い合わせください。", true);
      return;
    }

    const params = Object.fromEntries(new FormData(form).entries());
    params.requested_at = new Intl.DateTimeFormat("ja-JP", { dateStyle: "long", timeStyle: "short" }).format(new Date());

    submitButton.disabled = true;
    setMessage("送信しています…");

    try {
      window.emailjs.init({ publicKey: config.publicKey });
      await window.emailjs.send(config.serviceId, config.contactTemplateId, params);
      form.hidden = true;
      setMessage("お問い合わせありがとうございました。内容を確認後、1〜2営業日以内にご連絡します。", false);
    } catch (error) {
      setMessage("送信できませんでした。お手数ですが、時間をおいて再度お試しいただくか、LINEからお問い合わせください。", true);
      submitButton.disabled = false;
      console.error("Contact request failed", error);
    }
  });
})();
