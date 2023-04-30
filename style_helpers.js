window.style_helpers = (function () {
    function style_generic_table(table) {
        setStyles(table, {
            border: "1px solid black",
            borderCollapse: "collapse",
            margin: "auto",
            display: "block",
        });

        for (const th of table.querySelectorAll("th")) {
            setStyles(th, {
                padding: "4px",
                position: "sticky",
                top: "0px",
                border: "1px solid black",
            });
        }
    }

    function style_generic_td(td) {
        setStyles(td, {
            border: "1px solid black",
            padding: "4px",
        });
        return td;
    }

    function setStyles(elem, styles) {
        const info = [];
        const label = elem.id
            ? `#${elem.id}`
            : elem.className
            ? `.${elem.className}`
            : elem.tagName;

        info.push(`\nSetting styles for ${label}\n`);

        for (const [f, v] of Object.entries(styles)) {
            info.push(`  ${f}: ${v};`);
            elem.style[f] = v;
        }

        // console.trace(info.join("\n"));
        return elem;
    }

    return {
        style_generic_table,
        style_generic_td,
        setStyles,
    };
})();
