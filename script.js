document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initStats();
    initChecklist();
    initQuiz();
    initSupport();
    initChatbot();
    initForm();
    initTheme();
    initBurger();
});

function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));
}

function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(el) {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 30);
}

const checklistData = [
    "Я знаю, что такое буллинг и его виды",
    "Я могу распознать признаки травли",
    "Я знаю, куда обратиться за помощью",
    "Я сохраняю доказательства кибербуллинга",
    "Я не остаюсь в стороне, если вижу травлю",
    "Я уважаю границы других людей",
    "Я не делюсь личной информацией в сети",
    "Я умею говорить «нет» давлению"
];

function initChecklist() {
    const list = document.getElementById('checklist-items');
    const saved = JSON.parse(localStorage.getItem('checklist') || '[]');
    document.getElementById('total-count').textContent = checklistData.length;
    
    checklistData.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'checklist-item' + (saved.includes(index) ? ' checked' : '');
        li.innerHTML = `
            <div class="check-box"></div>
            <span class="checklist-text">${item}</span>
        `;
        li.addEventListener('click', () => toggleChecklistItem(li, index));
        list.appendChild(li);
    });
    updateChecklistProgress();
}

function toggleChecklistItem(el, index) {
    el.classList.toggle('checked');
    const saved = JSON.parse(localStorage.getItem('checklist') || '[]');
    if (el.classList.contains('checked')) {
        if (!saved.includes(index)) saved.push(index);
    } else {
        const i = saved.indexOf(index);
        if (i > -1) saved.splice(i, 1);
    }
    localStorage.setItem('checklist', JSON.stringify(saved));
    updateChecklistProgress();
}

function updateChecklistProgress() {
    const checked = document.querySelectorAll('.checklist-item.checked').length;
    const total = checklistData.length;
    document.getElementById('checked-count').textContent = checked;
    document.getElementById('checklist-progress').style.width = (checked / total * 100) + '%';
}

function resetChecklist() {
    localStorage.removeItem('checklist');
    document.querySelectorAll('.checklist-item').forEach(el => el.classList.remove('checked'));
    updateChecklistProgress();
}

const quizData = [
    {
        q: "Одноклассник систематически пишет тебе оскорбительные сообщения. Это:",
        options: ["Просто шутка", "Кибербуллинг", "Моя вина"],
        correct: 1
    },
    {
        q: "Ты видишь, как группу ребят обижают. Лучшее действие:",
        options: ["Снять на видео", "Позвать учителя и поддержать жертву", "Пройти мимо"],
        correct: 1
    },
    {
        q: "Что делать, если твои вещи портят без спроса?",
        options: ["Молчать", "Ответить силой", "Сказать «Стоп» и сообщить взрослому"],
        correct: 2
    },
    {
        q: "В чате класса тебя начали оскорблять анонимно:",
        options: ["Ответить грубостью", "Сделать скриншоты и рассказать взрослым", "Удалить аккаунт и молчать"],
        correct: 1
    },
    {
        q: "Друг перестал общаться с тобой и исключил из группы. Это:",
        options: ["Нормально", "Социальный буллинг", "Его право"],
        correct: 1
    }
];

let currentQ = 0;
let score = 0;

function initQuiz() {
    document.getElementById('q-total').textContent = quizData.length;
    loadQuestion();
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
}

function loadQuestion() {
    const data = quizData[currentQ];
    document.getElementById('question-text').textContent = data.q;
    document.getElementById('q-current').textContent = currentQ + 1;
    document.getElementById('q-score').textContent = score;
    document.getElementById('progress-fill').style.width = (currentQ / quizData.length * 100) + '%';
    
    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = '';
    
    data.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(btn, index));
        optionsBox.appendChild(btn);
    });
}

function handleAnswer(btn, index) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);
    
    if (index === quizData[currentQ].correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        buttons[quizData[currentQ].correct].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQ++;
        if (currentQ < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 1200);
}

function showResult() {
    document.getElementById('quiz-box').classList.add('hidden');
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('result-box').classList.remove('hidden');
    
    if (score === quizData.length) {
        document.getElementById('result-icon').textContent = '🏆';
        document.getElementById('result-title').textContent = 'Блестящий результат!';
        document.getElementById('result-desc').textContent = 'Ты отлично разбираешься в ситуациях травли и знаешь, как действовать.';
    } else if (score >= 3) {
        document.getElementById('result-icon').textContent = '👍';
        document.getElementById('result-title').textContent = 'Хороший результат!';
        document.getElementById('result-desc').textContent = `Ты ответил правильно на ${score} из ${quizData.length}. Ты на верном пути!`;
    } else {
        document.getElementById('result-icon').textContent = '💡';
        document.getElementById('result-title').textContent = 'Стоит узнать больше';
        document.getElementById('result-desc').textContent = `Ты ответил правильно на ${score} из ${quizData.length}. Прочитай раздел «Виды буллинга».`;
    }
}

function restartQuiz() {
    currentQ = 0;
    score = 0;
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('quiz-box').classList.remove('hidden');
    loadQuestion();
}

const supportData = {
    victim: {
        title: "Если травят тебя",
        text: "1. Не молчи — расскажи родителям или учителю, которому доверяешь. 2. Не отвечай агрессией. 3. Сохраняй скриншоты и доказательства. 4. Помни: проблема не в тебе, а в том, кто нарушает границы."
    },
    witness: {
        title: "Если ты свидетель",
        text: "Твоя позиция решает всё. Не смейся и не пересылай оскорбления. Поддержи жертву лично или публично. Сообщи взрослому. Твоё молчание воспринимается агрессором как разрешение."
    },
    parent: {
        title: "Если вы родитель",
        text: "Слушайте ребёнка без осуждения. Не говорите «сам разбирайся». Свяжитесь с классным руководителем и школьным психологом. Фиксируйте все факты письменно."
    },
    teacher: {
        title: "Если вы педагог",
        text: "Не игнорируйте сигналы. Проведите беседу отдельно с жертвой и агрессором. Вовлеките школьного психолога. Работайте с классом над эмпатией и уважением границ."
    }
};

function initSupport() {
    document.querySelectorAll('.support-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const scenario = btn.dataset.scenario;
            const data = supportData[scenario];
            document.getElementById('support-title').textContent = data.title;
            document.getElementById('support-text').textContent = data.text;
            const resDiv = document.getElementById('support-result');
            resDiv.classList.remove('hidden');
            resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
}

const modalData = {
    verbal: {
        title: "Вербальный буллинг",
        text: "Это систематические оскорбления, насмешки, прозвища, угрозы, распространение слухов. Слова ранят не меньше кулаков — они подрывают самооценку и могут привести к депрессии. Важно: если тебя оскорбляют, это не твоя вина. Расскажи взрослому и сохраняй доказательства (скриншоты, записи)."
    },
    physical: {
        title: "Физический буллинг",
        text: "Удары, толчки, пинки, порча или кража вещей. Это прямое нарушение закона и прав человека. Физический буллинг всегда требует немедленного вмешательства взрослых. Не бойся сообщить — это не «ябедничество», а защита себя и других."
    },
    cyber: {
        title: "Кибербуллинг",
        text: "Травля в соцсетях, мессенджерах, играх. Оскорбительные комментарии, слив личных фото, анонимные угрозы 24/7. Особенность — жертва не может скрыться даже дома. Что делать: не отвечай, блокируй обидчика, сохраняй скриншоты, рассказывай взрослым."
    },
    social: {
        title: "Социальный буллинг",
        text: "Изоляция, игнорирование, бойкот, исключение из группы. Тихая, но разрушительная форма травли. Жертва чувствует себя невидимой или лишней. Важно замечать таких людей — иногда простое «привет» может изменить их день."
    }
};

function openModal(key) {
    const data = modalData[key];
    const content = document.getElementById('modal-content');
    content.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
});

const chatResponses = {
    "распознать": "Признаки буллинга: регулярные оскорбления, изоляция, порча вещей, страх идти в школу, изменения в поведении, тревожность, потеря аппетита. Если ты замечаешь это у себя или друга — это серьёзный сигнал.",
    "обратиться": "Куда обратиться: 1) Родители или близкий взрослый. 2) Классный руководитель или школьный психолог. 3) Телефон доверия: 8-800-2000-122 (бесплатно, анонимно). 4) Сайт «Травли.Net». Не молчи — помощь есть!",
    "защитить": "Как защититься: 1) Чётко скажи «Стоп, мне это неприятно». 2) Не реагируй эмоционально — агрессор этого ждёт. 3) Держись уверенно, сохраняй спокойствие. 4) Обратись к взрослым. 5) Окружай себя поддерживающими людьми.",
    "закон": "Закон на твоей стороне: буллинг может подпадать под статьи УК РФ о побоях (116), оскорблении, клевете (128.1), угрозе (119). Кибербуллинг — тоже правонарушение. Школа обязана обеспечивать безопасность учеников."
};

function initChatbot() {
    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        input.value = '';
        setTimeout(() => {
            const response = getResponse(text);
            addMessage(response, 'bot');
        }, 600);
    });

    document.querySelectorAll('.suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.q;
            addMessage(btn.textContent, 'user');
            setTimeout(() => {
                addMessage(chatResponses[key], 'bot');
            }, 600);
        });
    });
}

function addMessage(text, type) {
    const messages = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + type;
    msg.innerHTML = `
        <div class="chat-avatar">${type === 'bot' ? '🤖' : '👤'}</div>
        <div class="chat-bubble"></div>
    `;
    msg.querySelector('.chat-bubble').textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

function getResponse(text) {
    const lower = text.toLowerCase();
    for (const key in chatResponses) {
        if (lower.includes(key)) return chatResponses[key];
    }
    if (lower.includes("привет") || lower.includes("здравствуй")) return "Привет! Я здесь, чтобы помочь. Задай вопрос о буллинге или выбери тему из подсказок.";
    if (lower.includes("спасибо")) return "Рад помочь! Если будут ещё вопросы — я рядом.";
    return "Я могу рассказать о видах буллинга, как защититься, куда обратиться и что говорит закон. Попробуй выбрать тему из подсказок ниже.";
}

function initForm() {
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value.trim().replace(/[<>]/g, "");
        const email = document.getElementById('user-email').value.trim();
        const message = document.getElementById('user-message').value.trim().replace(/[<>]/g, "");
        const consent = document.getElementById('privacy-consent').checked;
        
        let valid = true;
        
        if (name.length < 2) {
            document.getElementById('name-error').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('name-error').style.display = 'none';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('email-error').style.display = 'none';
        }
        
        if (message.length < 5) {
            document.getElementById('message-error').style.display = 'block';
            valid = false;
        } else {
            document.getElementById('message-error').style.display = 'none';
        }
        
        if (!consent) {
            alert('Необходимо согласие на обработку персональных данных');
            valid = false;
        }
        
        if (valid) {
            alert(`Спасибо, ${name}! Сообщение отправлено. (В учебном проекте данные не сохраняются).`);
            e.target.reset();
        }
    });
}

function initTheme() {
    const themes = ['light', 'dark', 'contrast'];
    const icons = { light: '☀️', dark: '🌙', contrast: '⚡' };
    const toggle = document.getElementById('theme-toggle');
    const icon = toggle.querySelector('.theme-icon');
    
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    icon.textContent = icons[saved];
    
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const nextIndex = (themes.indexOf(current) + 1) % themes.length;
        const next = themes[nextIndex];
        document.documentElement.setAttribute('data-theme', next);
        icon.textContent = icons[next];
        localStorage.setItem('theme', next);
    });
}

function initBurger() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            burger.classList.remove('open');
            nav.classList.remove('open');
        });
    });
}

function showPrivacy() {
    alert("Политика конфиденциальности:\n\n1. Сайт не собирает и не хранит персональные данные.\n2. Все интерактивные элементы работают локально в браузере.\n3. Сторонние трекеры не используются.\n4. Данные формы не отправляются на сервер в рамках учебного проекта.");
}