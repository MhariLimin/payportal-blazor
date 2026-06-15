(function () {
    const storageKey = "payportal-theme";

    function resolve(theme) {
        if (theme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        return theme;
    }

    function apply(theme) {
        document.documentElement.dataset.theme = resolve(theme);
        document.documentElement.style.colorScheme = resolve(theme);
    }

    const savedTheme = localStorage.getItem(storageKey) || "system";
    apply(savedTheme);

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
})();
