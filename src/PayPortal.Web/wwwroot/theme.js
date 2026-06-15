(function () {
    const storageKey = "payportal-theme";

    function resolve(theme) {
        if (theme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        return theme;
    }

    function apply(theme) {
        const resolvedTheme = resolve(theme);
        document.documentElement.dataset.theme = resolvedTheme;
        document.documentElement.dataset.themePreference = theme;
        document.documentElement.style.colorScheme = resolvedTheme;
    }

    function applySavedTheme() {
        apply(localStorage.getItem(storageKey) || "system");
    }

    applySavedTheme();

    window.payPortalTheme = {
        set: function (theme) {
            localStorage.setItem(storageKey, theme);
            apply(theme);
        }
    };

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if ((localStorage.getItem(storageKey) || "system") === "system") {
            apply("system");
        }
    });

    window.addEventListener("load", function () {
        if (window.Blazor) {
            window.Blazor.addEventListener("enhancedload", applySavedTheme);
        }
    });

    new MutationObserver(function () {
        const savedTheme = localStorage.getItem(storageKey) || "system";
        if (document.documentElement.dataset.themePreference !== savedTheme ||
            document.documentElement.dataset.theme !== resolve(savedTheme)) {
            apply(savedTheme);
        }
    }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-theme-preference"]
    });
})();
