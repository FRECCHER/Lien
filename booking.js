(() => {
  const form = document.querySelector("#booking-form");
  const menu = document.querySelector("#menu");
  const hairRemovalFields = document.querySelector("#hair-removal-fields");
  const lashFields = document.querySelector("#lash-fields");
  const message = document.querySelector("#form-message");
  const submitButton = document.querySelector("#submit-button");
  const config = window.LIEN_BOOKING_CONFIG || {};

  const setMessage = (text, isError = false) => {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
  };

  const setMinimumDate = () => {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    document.querySelectorAll('input[type="date"]').forEach((input) => { input.min = localToday; });
  };

  const timeSlots = Array.from({ length: 15 }, (_, index) => {
    const totalMinutes = 9 * 60 + index * 30;
    return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
  });

  const renderTimeOptions = () => {
    document.querySelectorAll(".time-options[data-time-field]").forEach((container) => {
      const fieldName = container.dataset.timeField;
      container.innerHTML = timeSlots.map((time) => `<label class="time-option"><input type="checkbox" name="${fieldName}" value="${time}" /><span>${time}</span></label>`).join("");
    });
  };

  const checkedTimes = (fieldName) => Array.from(document.querySelectorAll(`input[name="${fieldName}"]:checked`), (input) => input.value);
  const formatChoice = (dateName, timeName) => {
    const date = form.elements[dateName].value;
    const times = checkedTimes(timeName);
    return date ? `${date}　${times.join(" / ")}` : "未入力";
  };
  const hasCompleteDateChoice = (dateName, timeName, required = false) => {
    const hasDate = Boolean(form.elements[dateName].value);
    const hasTimes = checkedTimes(timeName).length > 0;
    return required ? hasDate && hasTimes : hasDate === hasTimes;
  };

  const updateMenuQuestions = () => {
    hairRemovalFields.hidden = menu.value !== "美肌脱毛";
    lashFields.hidden = menu.value !== "まつ毛パーマ";
  };

  menu.addEventListener("change", updateMenuQuestions);
  renderTimeOptions();
  setMinimumDate();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!hasCompleteDateChoice("first_date", "first_time", true)) {
      setMessage("第1希望の日にちと開始時間を選択してください。", true);
      return;
    }
    if (!hasCompleteDateChoice("second_date", "second_time") || !hasCompleteDateChoice("third_date", "third_time")) {
      setMessage("第2・第3希望は、日にちと開始時間をセットで選択してください。", true);
      return;
    }

    if (form.elements.website.value) return;
    if (!config.publicKey || !config.serviceId || !config.templateId || !window.emailjs) {
      setMessage("ただいま予約受付の準備中です。お手数ですが、LINEからお問い合わせください。", true);
      return;
    }

    const fields = new FormData(form);
    const params = Object.fromEntries(fields.entries());
    params.requested_at = new Intl.DateTimeFormat("ja-JP", { dateStyle: "long", timeStyle: "short" }).format(new Date());
    params.first_choice = formatChoice("first_date", "first_time");
    params.second_choice = formatChoice("second_date", "second_time");
    params.third_choice = formatChoice("third_date", "third_time");
    params.hair_removal_area = params.hair_removal_area || "未入力";
    params.lash_request = params.lash_request || "未入力";
    params.note = params.note || "なし";

    submitButton.disabled = true;
    setMessage("送信しています…");
    try {
      window.emailjs.init({ publicKey: config.publicKey });
      await window.emailjs.send(config.serviceId, config.templateId, params);
      form.hidden = true;
      setMessage("送信ありがとうございました。24時間以内にLINEでご連絡します。", false);
    } catch (error) {
      setMessage("送信できませんでした。お手数ですが、時間をおいて再度お試しいただくか、LINEからお問い合わせください。", true);
      submitButton.disabled = false;
      console.error("Booking request failed", error);
    }
  });
})();
