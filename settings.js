(function() {
	function getEl(id) { return document.getElementById(id); }
	const STORAGE_KEY = 'proAgendaSettings';

	function loadSettings() {
		try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
	}
	function saveSettings(partial) {
		const current = loadSettings();
		const next = { ...current, ...partial };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		return next;
	}

	async function saveAccountRemote(name, email) {
		try {
			const res = await fetch('update_user.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email })
			});
			const data = await res.json();
			if (!res.ok || !data.success) {
				throw new Error(data.error || 'Erro ao salvar');
			}
			return data.data;
		} catch (e) {
			throw e;
		}
	}

	function applyTheme(theme) {
		const isDark = theme === 'dark';
		if (isDark) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); }
		else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); }
		if (window.darkModeManager && typeof window.darkModeManager.updateIcons === 'function') {
			window.darkModeManager.isDarkMode = isDark;
			window.darkModeManager.updateIcons();
		}
	}
	function applyFontSize(size) {
		document.documentElement.style.setProperty('--app-font-scale', size === 'large' ? '1.075' : '1');
		document.body.style.fontSize = size === 'large' ? '1.025rem' : '';
	}
	function applyGeneral(settings) {
		const { language, timezone, theme, fontSize, name, email } = settings;
		const langSel = getEl('languageSelect');
		const tzSel = getEl('timezoneSelect');
		const themeSel = getEl('themeSelect');
		const fontSel = getEl('fontSizeSelect');
		const nameInp = getEl('nameInput');
		const emailInp = getEl('emailInput');
		if (langSel && language) langSel.value = language;
		if (tzSel && timezone) tzSel.value = timezone;
		if (themeSel && theme) themeSel.value = theme;
		if (fontSel && fontSize) fontSel.value = fontSize;
		if (nameInp && name) nameInp.value = name;
		if (emailInp && email) emailInp.value = email;
		if (theme) applyTheme(theme);
		if (fontSize) applyFontSize(fontSize);
	}

	document.addEventListener('DOMContentLoaded', function() {
		const settings = loadSettings();
		if (!settings.theme) settings.theme = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
		applyGeneral(settings);

		const langSel = getEl('languageSelect');
		const tzSel = getEl('timezoneSelect');
		const themeSel = getEl('themeSelect');
		const fontSel = getEl('fontSizeSelect');
		const saveBtn = getEl('saveAccountBtn');
		const nameInp = getEl('nameInput');
		const emailInp = getEl('emailInput');

		if (langSel) langSel.addEventListener('change', () => {
			const newLang = langSel.value;
			saveSettings({ language: newLang });
			// Aplicar mudança de idioma imediatamente
			if (window.setLanguage) {
				window.setLanguage(newLang);
			}
		});
		if (tzSel) tzSel.addEventListener('change', () => saveSettings({ timezone: tzSel.value }));
		if (themeSel) themeSel.addEventListener('change', () => { const theme = themeSel.value; saveSettings({ theme }); applyTheme(theme); });
		if (fontSel) fontSel.addEventListener('change', () => { const fontSize = fontSel.value; saveSettings({ fontSize }); applyFontSize(fontSize); });
		if (saveBtn) saveBtn.addEventListener('click', async () => {
			const name = nameInp?.value?.trim() || '';
			const email = emailInp?.value?.trim() || '';
			if (!name || !email) { alert('Preencha nome e email.'); return; }
			try {
				const updated = await saveAccountRemote(name, email);
				saveSettings({ name: updated.name, email: updated.email });
				const headerName = document.querySelector('.user-name');
				if (headerName) headerName.textContent = updated.name;
				alert('Dados salvos no servidor com sucesso.');
			} catch (e) {
				// Fallback: persiste local
				saveSettings({ name, email });
				alert('Falha ao salvar no servidor: ' + (e?.message || e) + '\nAs alterações foram salvas localmente.');
			}
		});
	});
})();
